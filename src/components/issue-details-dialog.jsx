"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import MDEditor from "@uiw/react-md-editor";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { deleteIssue, updateIssue } from "@/actions/issues";
import statuses from "@/data/statuses";
import useFetch from "@/hooks/use-fetch";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import UserAvatar from "./user-avatar";

export const priorityOptions = [
	{ value: "LOW", label: "Low" },
	{ value: "MEDIUM", label: "Medium" },
	{ value: "HIGH", label: "High" },
	{ value: "URGENT", label: "Urgent" },
];

export default function IssueDetailsDialogue({
	isOpen,
	onClose,
	issue,
	onDelete = () => {},
	onUpdate = () => {},
	boderColour = "",
}) {
	const [status, setStatus] = useState(issue.status);
	const [priority, setPriority] = useState(issue.priority);

	const { user } = useUser();
	const { membership } = useOrganization();

	const pathname = usePathname();
	const router = useRouter();

	const {
		loading: deleteIsLoading,
		fn: deleteIssueFn,
		error: deleteIssueError,
		data: deleted,
	} = useFetch(deleteIssue);

	const {
		loading: updateIsLoading,
		fn: updateIssueFn,
		error: updateIssueError,
		data: updated,
	} = useFetch(updateIssue);

	const onStatusChange = async (newStatus) => {
		setStatus(newStatus);
		updateIssueFn(issue.id, { status: newStatus, priority });
	};

	const onPriorityChange = async (newPriority) => {
		setPriority(newPriority);
		updateIssueFn(issue.id, { status, priority: newPriority });
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this issue?")) {
			deleteIssueFn(issue.id);
		}
	};

	useEffect(() => {
		if (deleted) {
			onClose();
			onDelete();
		}
		if (updated) {
			onUpdate(updated);
		}
	}, [deleted, updated, deleteIsLoading, updateIsLoading]);

	const canChange =
		user.id === issue.reporter.clerkUserId || membership.role === "org:admin";

	const isProjectPage = pathname.startsWith("/projects/");

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<div className="flex flex-col justify-between items-start ">
						<DialogTitle className={"text-3xl capitalize tracking-tighter"}>
							{issue.title}
						</DialogTitle>
						{!isProjectPage && (
							<Button
								variant={"ghost"}
								size={"icon"}
								onClick={() => {
									router.push(
										`/projects/${issue.projectId}?sprint=${issue.sprintId}`,
									);
								}}
								title="Go To Project"
							>
								<ExternalLink className="w-4 h-4" />
							</Button>
						)}
					</div>
				</DialogHeader>
				{(updateIsLoading || deleteIsLoading) && (
					<BarLoader width={"100%"} color="#36D7B7" />
				)}

				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Select value={status} onValueChange={onStatusChange}>
							<SelectTrigger className={"w-full"}>
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								{statuses.map((status, index) => (
									<SelectItem key={`${status.key}-${index}`} value={status.key}>
										{status.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={priority}
							onValueChange={onPriorityChange}
							disabled={!canChange}
						>
							<SelectTrigger
								className={`w-full border ${boderColour} rounded `}
							>
								<SelectValue placeholder="Priority" />
							</SelectTrigger>
							<SelectContent>
								{priorityOptions.map((priority) => (
									<SelectItem key={priority.value} value={priority.value}>
										{priority.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<h4 className="font-semibold">Description</h4>
						<MDEditor.Markdown
							className="rounded px-2 py-1"
							source={issue.description ? issue.description : "--"}
						/>
					</div>
					<div className="flex justify-between">
						<div className="flex flex-col gap-2">
							<h4 className="font-semibold">Assignee</h4>
							<UserAvatar user={issue.assignee} />
						</div>

						<div className="flex flex-col gap-2">
							<h4 className="font-semibold">Noticer</h4>
							<UserAvatar user={issue.reporter} />
						</div>
					</div>
					{canChange && (
						<Button
							variant={"destructive"}
							className={"w-full"}
							disabled={deleteIsLoading}
							onClick={handleDelete}
						>
							{deleteIsLoading ? "Deleting..." : "Delete Issue"}
						</Button>
					)}
					{(deleteIssueError || updateIssueError) && (
						<span className="text-red-500 text-sm p-2">
							{deleteIssueError?.message || updateIssueError?.message}
						</span>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
