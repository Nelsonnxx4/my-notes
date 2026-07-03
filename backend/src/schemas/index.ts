// backend/src/schemas/index.ts
import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
	accessToken: z.string().min(1, "Google access token is required"),
});

export const createNoteSchema = z.object({
	title: z.string().min(1, "Title is required").max(255, "Title is too long"),
	content: z.string().optional(),
	tag_ids: z.array(z.number().int().positive()).optional(),
	folder_id: z.string().optional(),
});

export const updateNoteSchema = z
	.object({
		title: z.string().min(1).max(255).optional(),
		content: z.string().optional(),
		is_pinned: z.boolean().optional(),
		is_archived: z.boolean().optional(),
		is_favorite: z.boolean().optional(),
		tag_ids: z.array(z.number().int().positive()).optional(),
		folder_id: z.string().nullable().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided",
	});

export const createTagSchema = z.object({
	name: z
		.string()
		.min(1, "Tag name is required")
		.max(50, "Tag name is too long")
		.trim(),
});

export const updateTagSchema = z.object({
	name: z
		.string()
		.min(1, "Tag name is required")
		.max(50, "Tag name is too long")
		.trim(),
});

export const createFolderSchema = z.object({
	name: z
		.string()
		.min(1, "Folder name is required")
		.max(100, "Folder name is too long")
		.trim(),
});

export const updateFolderSchema = z.object({
	name: z
		.string()
		.min(1, "Folder name is required")
		.max(100, "Folder name is too long")
		.trim(),
});
