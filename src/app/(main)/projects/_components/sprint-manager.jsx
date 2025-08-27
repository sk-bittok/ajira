"use client";

import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { updateSprintStatus } from "@/actions/sprints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";

export default function SprintManager({
	sprint,
	setSprint,
	sprints,
	projectId,
}) {
	const [status, setStatus] = useState(sprint.status);

	const searchParams = useSearchParams();
	const router = useRouter();

	const { loading, fn: updateStatus, data } = useFetch(updateSprintStatus);

	const startDate = new Date(sprint.startDate);
	const endDate = new Date(sprint.endDate);
	const now = new Date();

	useEffect(() => {
		if (data?.success) {
			setStatus(data.sprint.status);
			setSprint({ ...sprint, status: data.sprint.status });
		}
	}, [data]);

	const canStart =
		isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

	const canEnd = sprint.status === "ACTIVE";

	useEffect(() => {
		const sprintId = searchParams.get("sprint");
		if (sprintId) {
			router.replace(`/projects/${projectId}`, { scroll: false });
		}
	}, [searchParams, sprints]);

	const handleValueChange = (value) => {
		const selectedSprint = sprints.find((sprint) => sprint.id === value);
		setSprint(selectedSprint);
		setStatus(selectedSprint.status);

		router.replace(`/projects/${projectId}`, { shallow: true });
	};

	const handleStatusUpdate = async (status) => {
		await updateStatus(sprint.id, status);
	};

	const getStatusText = () => {
		if (status === "COMPLETED") {
			return "Sprint Ended";
		}

		if (status === "ACTIVE" && isAfter(now, endDate)) {
			return `Overdue by ${formatDistanceToNow(endDate)}`;
		}

		if (status === "PLANNED" && isBefore(now, startDate)) {
			return `Starts in ${formatDistanceToNow(startDate)}`;
		}
	};

	return (
		<>
			<div className="flex justify-between items-center gap-4">
				<Select value={sprint.id} onValueChange={handleValueChange}>
					<SelectTrigger className="bg-slate-950 self-start w-full">
						<SelectValue placeholder="Select Sprint" />
					</SelectTrigger>
					<SelectContent>
						{sprints.map((sprint, index) => (
							<SelectItem key={`${sprint.id}-${index}`} value={sprint.id}>
								{sprint.name} ({format(sprint.startDate, "PPP")}) to (
								{format(sprint.endDate, "PPP")})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{canStart && (
					<Button
						type="button"
						onClick={() => handleStatusUpdate("ACTIVE")}
						disabled={loading}
						className="bg-emerald-900 text-white hover:bg-emerald-800"
					>
						Begin Sprint
					</Button>
				)}

				{canEnd && (
					<Button
						type="button"
						onClick={() => handleStatusUpdate("COMPLETED")}
						disabled={loading}
						className="bg-indigo-900 text-white hover:bg-indigo-800"
					>
						Complete Sprint
					</Button>
				)}
			</div>

			{loading && <BarLoader width={"100%"} className="mt-2" color="#36D7B7" />}

			{getStatusText() && (
				<Badge className="mt-3 ml-1 self-start">{getStatusText()}</Badge>
			)}
		</>
	);
}
