/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function OnboardingPage() {
	const { organization } = useOrganization();
	const router = useRouter();

	useEffect(() => {
		if (organization) {
			router.push(`/organisations/${organization.slug}`);
		}
	}, [organization]);

	return (
		<div className="flex justify-center items-center pt-14 ">
			<OrganizationList
				hidePersonal
				afterCreateOrganizationUrl="/organisations/:slug"
				afterSelectOrganizationUrl="/organisations/:slug"
			/>
		</div>
	);
}

export default OnboardingPage;
