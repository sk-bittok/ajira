import Link from "next/link";
import { getProjectsList } from "@/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProject from "./delete-project";

async function ProjectList({ orgId }) {
	const projects = await getProjectsList(orgId);

	if (projects.length === 0) {
		return (
			<p>
				No projects found.&nbsp;
				<Link
					href={"/projects/create"}
					className="underline underline-offset-2 text-blue-200"
				>
					Create New
				</Link>
			</p>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{projects.map((project, index) => {
				return (
					<Card key={`${project.id}-${index}`} className={"bg-gray-800"}>
						<CardHeader>
							<CardTitle className={"flex justify-between items-center"}>
								{project.name}
								<DeleteProject projectId={project.id} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500 mb-4">
								{project.description}
							</p>
							<Link
								href={`/projects/${project.id}`}
								className="text-blue-500 hover:underline"
							>
								View Project
							</Link>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

export default ProjectList;
