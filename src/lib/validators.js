import z from "zod";

export const projectSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be under 100 characters"),
	key: z
		.string()
		.min(2, "Key requires 2 characters.")
		.max(10, "Key must be under 10 characters"),
	description: z
		.string()
		.max(500, "Description must be under 500 characters.")
		.optional(),
});

export const sprintSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required.")
		.max(100, "Name must be under 100 characters"),
	startDate: z.date(),
	endDate: z.date(),
});

export const issueSchema = z.object({
	title: z.string().min(1, "Title is required").max(
		50,
		"Title must be under 50 characters",
	),
	assigneeId: z.cuid("Please select a valid assignee."),
	description: z
		.string()
		.max(500, "Description must be under 500 characters.")
		.optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});
