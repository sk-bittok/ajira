"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sprintSchema } from "@/lib/validators";
import { addDays, format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SprintCreationForm({
	projectTitle,
	projectKey,
	projectId,
	sprintKey,
}) {
	const [showForm, setShowForm] = useState(false);
	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: addDays(new Date(), 14),
	});
	const router = useRouter();
	const { loading: creatingSprint, fn: createSprintFn } =
		useFetch(createSprint);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(sprintSchema),
		defaultValues: {
			name: `${projectKey}-${sprintKey}`,
			startDate: dateRange.from,
			endDate: dateRange.to,
		},
	});

	const onSubmit = async (data) => {
		const sprintData = {
			name: data.name,
			startDate: dateRange.from,
			endDate: dateRange.to,
		};

		await createSprintFn(projectId, sprintData);
		setShowForm(false);
		toast.success("Sprint added succesfully");
		router.refresh();
	};

	return (
		<>
			<div className="flex justify-between">
				<h1 className="text-5xl font-bold gradient-title mb-8 capitalize">
					{projectTitle}
				</h1>
				<Button
					type="button"
					onClick={() => setShowForm(!showForm)}
					className={"mt-2"}
					variant={showForm ? "destructive" : "default"}
				>
					{showForm ? "Cancel" : "Create New Sprint"}
				</Button>
			</div>
			{showForm && (
				<Card className={"pt-4 mb-4 bg-gray-800"}>
					<CardContent>
						<form
							className="flex gap-4 items-end"
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className="flex-1">
								<label
									htmlFor="name"
									className="block text-sm font-medium mb-2"
								>
									Name
								</label>
								<Input
									id="name"
									key="name"
									readOnly
									className={"bg-slate-950"}
									{...register("name")}
								/>
								{errors.name && (
									<p className="mt-2 text-red-600 text-sm p-2">
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="flex-1">
								<label
									htmlFor="name"
									className="block text-sm font-medium mb-2"
								>
									Duration
								</label>
								<Controller
									control={control}
									name="dateRange"
									render={({ field }) => {
										return (
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={`w-full justify-start text-left font-normal bg-slate-950 ${!dateRange && "text-muted-foreground"}`}
													>
														<CalendarIcon className="h-5 w-5 mr-2" />
														{dateRange.from && dateRange.to ? (
															format(dateRange.from, "LLL dd, y") +
															" - " +
															format(dateRange.to, "LLL dd, y")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent
													className={"w-auto bg-slate-900"}
													align="start"
												>
													<DayPicker
														mode="range"
														selected={dateRange}
														onSelect={(range) => {
															if (range?.from && range?.to) {
																setDateRange(range);
																field.onChange({
																	startDate: range.from,
																	endDate: range.to,
																});
															}
														}}
														disabled={[{ before: new Date() }]}
														classNames={{
															chevron: "fill-blue-500",
															range_start: "bg-blue-700",
															range_end: "bg-blue-700",
															range_middle: "bg-blue-400",
															day_button: "border-none",
															today: "border-2 border-blue-700",
														}}
													/>
												</PopoverContent>
											</Popover>
										);
									}}
								/>
							</div>
							<Button
								type="submit"
								disabled={creatingSprint}
								className={
									"bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-900"
								}
							>
								{creatingSprint ? "Creating Sprint..." : "Create Sprint"}
							</Button>
						</form>
					</CardContent>
				</Card>
			)}
		</>
	);
}

export default SprintCreationForm;
