"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function createIssue(projectId, data) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return new Error("Unauthorised");
	}

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	const lastIssue = await db.issue.findFirst({
		where: {
			projectId,
			status: data.status,
		},
		orderBy: { order: "desc" },
	});

	const newOrder = lastIssue ? lastIssue.order + 1 : 0;

	const issue = await db.issue.create({
		data: {
			title: data.title,
			description: data.description,
			status: data.status,
			priority: data.priority,
			projectId: projectId,
			sprintId: data.sprintId,
			reporterId: user.id,
			assigneeId: data.assigneeId,
			order: newOrder,
		},
		include: {
			reporter: true,
			assignee: true,
		},
	});

	return issue;
}

export async function getIssuesBySprint(sprintId) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorised");
	}

	const issues = await db.issue.findMany({
		where: {
			sprintId,
		},
		include: {
			reporter: true,
			assignee: true,
		},
		orderBy: [
			{
				order: "asc",
			},
			{ status: "asc" },
		],
	});

	return issues;
}

export async function updateIssueOrder(updatedIssues) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorised");
	}

	await db.$transaction(async (primsa) => {
		for (const issue of updatedIssues) {
			await primsa.issue.update({
				where: { id: issue.id },
				data: {
					status: issue.status,
					order: issue.order,
				},
			});
		}
	});

	return { success: true };
}

export async function deleteIssue(issueId) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorised");
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const issue = await db.issue.findUnique({
		where: { id: issueId },
		include: { project: true },
	});

	if (!issue) {
		throw new Error("Issue not found");
	}

	if (
		issue.reporterId !== user.id &&
		!issue.project.adminIds.includes(user.id)
	) {
		throw new Error("You don't have permission to delete this issue");
	}

	await db.issue.delete({ where: { id: issueId } });

	return { success: true };
}

export async function updateIssue(issueId, data) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorised");
	}

	try {
		const issue = await db.issue.findUnique({
			where: { id: issueId },
			include: { project: true },
		});

		if (!issue) {
			throw new Error("Issue not found");
		}

		if (issue.project.organisationId !== orgId) {
			throw new Error("Unauthorised");
		}

		const updatedIssue = await db.issue.update({
			where: { id: issueId },
			data: {
				status: data.status,
				priority: data.priority,
			},
			include: {
				assignee: true,
				reporter: true,
			},
		});

		return updatedIssue;
	} catch (error) {
		throw new Error(`Error updating issue: ${error.message}`);
	}
}

export async function getUserIssues(userId) {
	const { orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorised");
	}

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const issues = await db.issue.findMany({
		where: {
			OR: [{ assigneeId: user.id }, { reporterId: user.id }],
			project: {
				organisationId: orgId,
			},
		},
		include: {
			project: true,
			assignee: true,
			reporter: true,
		},
		orderBy: { updatedAt: "desc" },
	});

	return issues;
}
