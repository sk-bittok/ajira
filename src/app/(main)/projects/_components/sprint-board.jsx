"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { getIssuesBySprint, updateIssueOrder } from "@/actions/issues";
import IssueCard from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import statuses from "@/data/statuses";
import useFetch from "@/hooks/use-fetch";
import SprintManager from "../_components/sprint-manager";
import CreateIssueDrawer from "./create-issue";
import FilterIssues from "./filter-issues";

function SprintBoard({ sprints, projectId, orgId }) {
	const [currentSprint, setCurrentSprint] = useState(
		sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0],
	);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedIssueStatus, setSelectedIssueStatus] = useState(null);

	const {
		loading: issuesLoading,
		data: issues,
		error: issueError,
		fn: fetchIssues,
		setData: setIssues,
	} = useFetch(getIssuesBySprint);

	useEffect(() => {
		if (currentSprint.id) {
			fetchIssues(currentSprint.id);
		}
	}, [currentSprint.id]);

	const {
		fn: updateIssues,
		loading: updateIssueLoading,
		error: updateIssueError,
	} = useFetch(updateIssueOrder);

	const [filteredIssues, setFilteredIssues] = useState(issues);

	const handleFilterChange = (filteredData) => {
		setFilteredIssues(filteredData);
	};

	const handleAddIssue = (status) => {
		setSelectedIssueStatus(status);
		setIsDrawerOpen(true);
	};

	const onIssueCreated = () => {
		fetchIssues(currentSprint.id);
	};

	const handleDragEnd = async (result) => {
		// logic to handle drag end
		if (currentSprint.status === "COMPLETED") {
			toast.warning("Cannot modify issues in a completed sprint.");
			return;
		}

		if (currentSprint.status === "PLANNED") {
			toast.warning("To modify issues, start the sprint first.");
			return;
		}

		const { destination, source } = result;

		if (!destination) return;

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const newOrderedData = [...issues];

		const sourceList = newOrderedData.filter(
			(list) => list.status === source.droppableId,
		);

		const destinationList = newOrderedData.filter(
			(list) => list.status === destination.droppableId,
		);

		// if source and destination are the same
		if (source.droppableId === destination.droppableId) {
			const reordered = reorder(sourceList, source.index, destination.index);

			reordered.forEach((item, index) => {
				item.order = index;
			});
		} else {
			// moving to different list
			const [movedItem] = sourceList.splice(source.index, 1);

			// give the moved item the new status
			movedItem.status = destination.droppableId;

			// add it to the destination list
			destinationList.splice(destination.index, 0, movedItem);

			sourceList.forEach((item, index) => {
				item.order = index;
			});

			destinationList.forEach((item, index) => {
				item.order = index;
			});
		}

		const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
		setIssues(newOrderedData, sortedIssues);

		updateIssues(sortedIssues);
	};

	if (issueError) {
		return <div className="text-red-500">Error loading issues.</div>;
	}

	return (
		<div className="mx-auto container">
			{/* sprint manager  */}
			<SprintManager
				sprint={currentSprint}
				setSprint={setCurrentSprint}
				projectId={projectId}
				sprints={sprints}
			/>

			{issues && !issuesLoading && (
				<FilterIssues issues={issues} onFilterChange={handleFilterChange} />
			)}

			{updateIssueError && (
				<p className="text-red-500 text-sm mt-2 p-2">
					{updateIssueError.message}
				</p>
			)}

			{issuesLoading ||
				(updateIssueLoading && (
					<BarLoader width="100%" color="#36D7B7" className="mt-4" />
				))}

			{/* Kanban Board */}
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
					{statuses.map((column) => (
						<Droppable key={column.key} droppableId={column.key}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="space-y-2"
								>
									<h3 className="font-bold mb-2 text-center">{column.name}</h3>
									{/* Issues */}
									{filteredIssues
										?.filter((issue) => issue.status === column.key)
										.map((issue, index) => (
											<Draggable
												key={issue.id}
												draggableId={issue.id}
												index={index}
												isDragDisabled={updateIssueLoading}
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<IssueCard
															issue={issue}
															onDelete={() => fetchIssues(currentSprint.id)}
															onUpdate={(updated) =>
																setIssues((issues) =>
																	issues.map((issue) => {
																		if (issue.id === updated.id) return updated;

																		return issue;
																	}),
																)
															}
														/>
													</div>
												)}
											</Draggable>
										))}

									{provided.placeholder}

									{column.key === "TODO" &&
										currentSprint.status !== "COMPLETED" && (
											<Button
												onClick={() => handleAddIssue(column.key)}
												className="flex items-center gap-2 w-full"
												variant={"ghost"}
											>
												<Plus className="w-4 h-4" /> Report Issue
											</Button>
										)}
								</div>
							)}
						</Droppable>
					))}
				</div>
			</DragDropContext>
			<CreateIssueDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				sprintId={currentSprint.id}
				status={selectedIssueStatus}
				projectId={projectId}
				onIssueCreated={onIssueCreated}
				orgId={orgId}
			/>
		</div>
	);
}

export default SprintBoard;

function reorder(list, startIndex, endIndex) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
}
