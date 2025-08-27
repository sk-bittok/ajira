import { notFound } from "next/navigation";
import { getProject } from "@/actions/projects";
import SprintCreationForm from "../_components/sprint-creation-form";
import SprintBoard from "../_components/sprint-board";

export default async function ProjectPage({ params }) {
	const { projectId } = await params;

	const project = await getProject(projectId);

	if (!project) {
		notFound();
	}

	return (
		<div className="continer mx-auto">
			{/* Sprint Creation */}
			<SprintCreationForm
				projectTitle={project.name}
				projectKey={project.key}
				projectId={project.id}
				sprintKey={project.sprints?.length + 1}
			/>

			{/* Sprint Board */}
			{project.sprints.length > 0 ? (
				<SprintBoard
					sprints={project.sprints}
					projectId={projectId}
					orgId={project.organisationId}
				/>
			) : (
				<div>Add a sprint</div>
			)}
		</div>
	);
}
