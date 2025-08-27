"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getOrganisation(slug) {
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

	const client = await clerkClient();

	const organisation = await client.organizations.getOrganization({
		slug,
	});

	if (!organisation) {
		return null;
	}

	const { data: membership } = await client.organizations
		.getOrganizationMembershipList({
			organizationId: organisation.id,
		});

	const userMembership = membership.find(
		(member) => member.publicUserData.userId === userId,
	);

	if (!userMembership) {
		return null;
	}

	return organisation;
}

export async function getOrganisationUsers(orgId) {
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

	const client = await clerkClient();
	const memberships = await client.organizations
		.getInstanceOrganizationMembershipList({
			organizationId: orgId,
		});

	const userIds = memberships.data.map((member) =>
		member.publicUserData.userId
	);

	const users = await db.user.findMany({
		where: {
			clerkUserId: {
				in: userIds,
			},
		},
	});

	return users;
}
