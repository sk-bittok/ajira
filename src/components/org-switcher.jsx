"use client";

import {
	OrganizationSwitcher,
	SignedIn,
	useOrganization,
	useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function OrganisationSwitcher() {
	const { isLoaded } = useOrganization();
	const { isLoaded: isUserLoaded } = useUser();
	const pathname = usePathname();

	if (!isLoaded || !isUserLoaded) {
		return null;
	}

	return (
		<div>
			<SignedIn>
				<OrganizationSwitcher
					hidePersonal
					afterCreateOrganizationUrl="/organisations/:slug"
					afterSelectOrganizationUrl="/organisations/:slug"
					createOrganizationMode={
						pathname === "/onboarding" ? "navigation" : "modal"
					}
					createOrganizationUrl="/onboarding"
					appearance={{
						elements: {
							organizationSwitcherTrigger:
								"border-2 border-gray-300 rounded-md px-5 py-2",
							organizationSwitcherTriggerIcon: "text-white",
						},
					}}
				/>
			</SignedIn>
		</div>
	);
}
