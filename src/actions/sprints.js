"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function createSprint(projectId, data) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return new Error("Unauthorized");
	}

	const project = await db.project.findUnique({
		where: {
			id: projectId,
		},
	});

	if (!project || project.organisationId !== orgId) {
		throw new Error("Project not found");
	}

	const sprint = await db.sprint.create({
		data: {
			name: data.name,
			startDate: data.startDate,
			endDate: data.endDate,
			status: "PLANNED",
			projectId,
		},
	});

	return sprint;
}

export async function updateSprintStatus(sprintId, newStatus) {
	const { userId, orgId, orgRole } = await auth();

	if (!userId || !orgId) {
		return new Error("Unauthorized");
	}

	try {
		const sprint = await db.sprint.findUnique({
			where: { id: sprintId },
			include: { project: true },
		});

		if (!sprint) {
			throw new Error("Sprint not found");
		}

		if (sprint.project.organisationId !== orgId) {
			throw new Error("Forbidden");
		}

		if (orgRole !== "org:admin") {
			throw new Error("Forbidden. Only admins can make this change.");
		}

		const startDate = new Date(sprint.startDate);
		const endDate = new Date(sprint.endDate);
		const now = new Date();

		if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
			throw new Error(
				"Sprint cannot be started outside of its planned date range.",
			);
		}

		if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
			throw new Error("Onyl Active Sprints can be completed.");
		}

		const updatedSprint = await db.sprint.update({
			where: {
				id: sprintId,
			},
			data: { status: newStatus },
		});

		return { success: true, sprint: updatedSprint };
	} catch (error) {
		throw new Error(error.message);
	}
}
