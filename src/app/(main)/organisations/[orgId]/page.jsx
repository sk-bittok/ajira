import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganisation } from "@/actions/organisations";
import OrganisationSwitcher from "@/components/org-switcher";
import ProjectList from "../_components/project-list";
import UserIssues from "../_components/user-issues";

async function OrganisationPage({ params }) {
	const { orgId } = params;

	const organisation = await getOrganisation(orgId);

	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	return (
		<div className="container mx-auto ">
			<div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
				<h1 className="text-5xl font-bold gradient-title pb-2">
					{organisation.name}&rsquo; Projects
				</h1>
				{/* Organisation switcher */}
				<OrganisationSwitcher />
			</div>
			<div className="mb-4">
				<ProjectList orgId={organisation.id} />
			</div>
			<div className="mt-8">
				<UserIssues userId={userId} />
			</div>
		</div>
	);
}

export default OrganisationPage;
