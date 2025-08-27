"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { deleteProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

function DeleteProject({ projectId }) {
	const { membership } = useOrganization({
		membership: true,
	});
	const router = useRouter();

	const isAdmin = membership?.role === "org:admin";

	const { data, loading, error, fn: deleteProjectFn } = useFetch(deleteProject);

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this project?")) {
			deleteProjectFn(projectId);
		}
	};

	useEffect(() => {
		if (data?.success) {
			toast.success("Project deleted successfully.");
			router.refresh();
		}
	}, [data, router.refresh]);

	if (!isAdmin) {
		return null;
	}

	return (
		<>
			<Button
				variant={"ghost"}
				size={"sm"}
				onClick={handleDelete}
				disabled={loading}
				className={`hover:bg-red-300 ${loading ? "animate-pulse" : ""}`}
			>
				<Trash2 className="h-4 w-4 text-red-500" />
			</Button>
			{error && <p className="text-red-500 text-sm">{error.message}</p>}
		</>
	);
}

export default DeleteProject;
