import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { priorityOptions } from "@/components/issue-details-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const FilterIssues = ({ issues, onFilterChange }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAssignees, setSelectedAssignees] = useState([]);
	const [selectedPriority, setSelectedPriority] = useState("");

	const assignees = issues
		.map((issue) => issue.assignee)
		.filter(
			(item, index, self) => index === self.findIndex((t) => t.id === item.id),
		);

	useEffect(() => {
		const filteredIssues = issues.filter(
			(issue) =>
				issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
				(selectedAssignees.length === 0 ||
					selectedAssignees.includes(issue.assignee?.id)) &&
				(selectedPriority === "" || issue.priority === selectedPriority),
		);
		onFilterChange(filteredIssues);
	}, [searchTerm, selectedAssignees, selectedPriority, issues]);

	const isFilterApplied =
		searchTerm !== "" ||
		selectedAssignees.length > 0 ||
		selectedPriority !== "";

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedPriority("");
		setSelectedAssignees([]);
	};

	const toggleAssignee = (id) => {
		setSelectedAssignees((assignees) =>
			assignees.includes(id)
				? assignees.filter((assigneeId) => assigneeId !== id)
				: [...assignees, id],
		);
	};

	return (
		<div className="w-full">
			<div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
				<Input
					type={"search"}
					placeholder="Search issues..."
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					className={"w-full sm:w-72"}
				/>

				<div className="flex-shrink-0">
					<div className="flex gap-2 flex-wrap">
						{assignees.map((assignee, index) => {
							const selected = selectedAssignees.includes(assignee.id);
							return (
								<div
									key={assignee.id}
									className={`cursor-pointer rounded-full ring-2 ${selected ? "ring-indigo-600" : "ring-black"} ${index > 0 ? "-ml-6" : ""}`}
									style={{
										zIndex: index,
									}}
									onClick={() => toggleAssignee(assignee.id)}
								>
									<Avatar className={"w-10 h-10"}>
										<AvatarImage src={assignee.imageUrl} />
										<AvatarFallback>{assignee.name[0]}</AvatarFallback>
									</Avatar>
								</div>
							);
						})}
					</div>
				</div>

				<Select value={selectedPriority} onValueChange={setSelectedPriority}>
					<SelectTrigger className={`w-full sm:w-52 `}>
						<SelectValue placeholder="Select Priority" />
					</SelectTrigger>
					<SelectContent>
						{priorityOptions.map((priority) => (
							<SelectItem key={priority.value} value={priority.value}>
								{priority.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{isFilterApplied && (
					<Button
						type="button"
						variant={"ghost"}
						onClick={clearFilters}
						className={"flex items-center gap-1"}
					>
						<X className="w-4 h-4" />
						<span>Clear Filters</span>
					</Button>
				)}
			</div>
		</div>
	);
};

export default FilterIssues;
