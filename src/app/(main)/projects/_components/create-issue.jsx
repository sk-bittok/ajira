"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { createIssue } from "@/actions/issues";
import { getOrganisationUsers } from "@/actions/organisations";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { issueSchema } from "@/lib/validators";
import { toast } from "sonner";

const PriorityOptions = [
	{ label: "Low", value: "LOW" },
	{ label: "Medium", value: "MEDIUM" },
	{ label: "High", value: "HIGH" },
	{ label: "Urgent", value: "URGENT" },
];

function CreateIssueDrawer({
	isOpen,
	onClose,
	sprintId,
	status,
	projectId,
	onIssueCreated,
	orgId,
}) {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(issueSchema),
		defaultValues: {
			description: "",
			assigneeId: "",
			priority: "MEDIUM",
		},
	});

	const {
		loading: createIssueLoading,
		fn: createIssueFn,
		error,
		data: newIssue,
	} = useFetch(createIssue);

	useEffect(() => {
		if (newIssue) {
			reset();
			onClose();

            toast.success("Issue successfully reported.");
			onIssueCreated();
		}
	}, [newIssue, createIssueLoading]);

	const {
		loading: usersLoading,
		fn: fetchUsers,
		data: users,
	} = useFetch(getOrganisationUsers);

	useEffect(() => {
		if (isOpen && orgId) {
			fetchUsers(orgId);
		}
	}, [isOpen, orgId]);

	const onSubmit = async (data) => {
		// Send to the database for creation
		await createIssueFn(projectId, { ...data, status, sprintId });
	};

	return (
		<Drawer open={isOpen} onClose={onClose}>
			<DrawerTrigger asChild>Open</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Add A New Issue</DrawerTitle>
					<DrawerDescription>
						Report an error so our technicians can fix them.
					</DrawerDescription>
				</DrawerHeader>
				{usersLoading && <BarLoader width={"100%"} color="36D7B7" />}
				<form className="space-y-4 p-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="">
						<label htmlFor="title" className="text-sm mb-1 font-medium">
							Title
						</label>
						<Input id="title" {...register("title")} />
						{errors.title && (
							<p className="text-sm text-red-500 mt-1">
								{errors.title.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="">
							<label htmlFor="assigneeId" className="text-sm mb-1 font-medium">
								Assignee
							</label>
							<Controller
								name="assigneeId"
								control={control}
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select assignee" />
										</SelectTrigger>
										<SelectContent>
											{users?.map((user) => (
												<SelectItem key={user.id} value={user.id}>
													{user?.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.assigneeId && (
								<p className="text-sm text-red-500 mt-1">
									{errors.assigneeId.message}
								</p>
							)}
						</div>

						<div className="">
							<label htmlFor="priority" className="text-sm mb-1 font-medium">
								Priority
							</label>
							<Controller
								name="priority"
								control={control}
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select priority" />
										</SelectTrigger>
										<SelectContent>
											{PriorityOptions.map((priority) => (
												<SelectItem key={priority.value} value={priority.value}>
													{priority.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					</div>
					<div className="">
						<label htmlFor="description" className="text-sm mb-1 font-medium">
							Description
						</label>
						<Controller
							control={control}
							name="description"
							render={({ field }) => (
								<MDEditor value={field.value} onChange={field.onChange} />
							)}
						/>
						{errors.description && (
							<p className="text-sm text-red-500 mt-1">
								{errors.title.description}
							</p>
						)}
					</div>

					{error && <p className="text-red-500 tex-sm mt-1">{error.message}</p>}
					<Button
						type="submit"
						disabled={createIssueLoading}
						className="w-full"
					>
						{createIssueLoading ? "Adding..." : "Add Issue"}
					</Button>
				</form>
			</DrawerContent>
		</Drawer>
	);
}

export default CreateIssueDrawer;
