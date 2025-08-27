"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function createProject(data) {
	const { userId, orgId } = await auth();

	if (!userId) {
		return new Error("Unauthorized");
	}

	if (!orgId) {
		return new Error("No organisation selected");
	}

	const client = await clerkClient();

	const { data: membership } =
		await client.organizations.getOrganizationMembershipList({
			organizationId: orgId,
		});

	const userMembership = membership.find(
		(member) => member.publicUserData.userId === userId,
	);

	if (!userMembership || userMembership.role !== "org:admin") {
		throw new Error("Only organization admins can create projects.");
	}

	try {
		console.log("Organisation ID ", orgId);
		const project = await db.project.create({
			data: {
				name: data.name,
				key: data.key,
				description: data.description,
				organisationId: orgId,
			},
		});

		return project;
	} catch (error) {
		console.error(error);
		throw new Error("Error creating project ", error.message);
	}
}

export async function getProjectsList(orgId) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("Unauthorised");
	}

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	const projects = await db.project.findMany({
		where: {
			organisationId: orgId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return projects;
}

export async function deleteProject(projectId) {
	const { userId, orgId, orgRole } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorised");
	}

	if (orgRole !== "org:admin") {
		throw new Error("Only admins can delete projects.");
	}

	const project = await db.project.findUnique({
		where: {
			id: projectId,
		},
	});

	if (!projectId || project.organisationId !== orgId) {
		throw new Error("Project not found.");
	}

	await db.project.delete({
		where: {
			id: projectId,
		},
	});

	return { success: true };
}

export async function getProject(projectId) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		throw new Error("Unauthorised");
	}

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	const project = await db.project.findUnique({
		where: {
			id: projectId,
		},
		include: {
			sprints: {
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!project) {
		return null;
	}

	if (project.organisationId !== orgId) {
		return null;
	}

	return project;
}
