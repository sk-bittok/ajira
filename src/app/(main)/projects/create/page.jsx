"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProject } from "@/actions/projects";
import OrganisationSwitcher from "@/components/org-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/lib/validators";

export default function CreateProjectPage() {
	const { isLoaded: isOrgLoaded, membership } = useOrganization();
	const { isLoaded: isUserLoaded } = useUser();
	const [isAdmin, setIsAdmin] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(projectSchema),
		mode: "onBlur",
		defaultValues: {
			name: "",
			key: "",
			description: "",
		},
	});

	useEffect(() => {
		if (isOrgLoaded && isUserLoaded && membership) {
			setIsAdmin(membership.role === "org:admin");
		}
	}, [isOrgLoaded, isUserLoaded, membership]);

	const {
		data: project,
		loading,
		error,
		fn: createProjectFn,
	} = useFetch(createProject);

	useEffect(() => {
		if (project) {
			toast.success("Project added succesfully");
			router.push(`/projects/${project.id}`);
		}
	}, [project, router.push]);

	const onSubmit = async (data) => {
		await createProjectFn(data);
	};

	if (!isOrgLoaded && !isUserLoaded) {
		return null;
	}

	if (!isAdmin) {
		return (
			<div className="flex flex-col gap-2 items-center">
				<span className="text-2xl gradient-title">
					Only admin can create projects!
				</span>
				<OrganisationSwitcher />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-6xl text-center font-bold mb-8 gradient-title">
				Create New Project
			</h1>

			<form
				className="flex flex-col space-y-4 p-8"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<Input
						id="name"
						className={"bg-slate-950"}
						placeholder="Project Name"
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-sm text-red-600 mt-2">{errors.name.message}</p>
					)}
				</div>
				<div>
					<Input
						id="key"
						className={"bg-slate-950"}
						placeholder="Project Key i.e. RCYT"
						{...register("key")}
					/>
					{errors.key && (
						<p className="text-sm text-red-600 mt-2">{errors.key.message}</p>
					)}
				</div>

				<div>
					<Textarea
						id="description"
						className={"bg-slate-950 h-40"}
						placeholder="Project Description"
						{...register("description")}
					/>
					{errors.description && (
						<p className="text-sm text-red-600 mt-1">
							{errors.description.message}
						</p>
					)}
				</div>
				<Button
					type="submit"
					disabled={loading}
					className="bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-200 disabled:text-gray-700"
					size="lg"
				>
					{loading ? "Creating Project..." : "Create Project"}
				</Button>
				{error && <p className="text-red-500 mt-4">{error.message}</p>}
			</form>
		</div>
	);
}
