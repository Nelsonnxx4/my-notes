import prisma from "../config/prisma";
import type { CreateNoteDTO, UpdateNoteDTO } from "../types";

const noteWithTags = {
	id: true,
	userId: true,
	title: true,
	content: true,
	isPinned: true,
	isArchived: true,
	createdAt: true,
	updatedAt: true,
	noteTags: {
		select: {
			tag: { select: { id: true, name: true } },
		},
	},
} as const;

const formatNote = (note: {
	noteTags: { tag: { id: number; name: string } }[];
	[key: string]: unknown;
}) => {
	const { noteTags, ...rest } = note;
	return { ...rest, tags: noteTags.map((nt) => nt.tag) };
};

export const getNotesByUser = async (
	userId: string,
	search?: string,
	tagId?: number,
) => {
	const notes = await prisma.notes.findMany({
		where: {
			userId,
			isArchived: false,
			...(search && {
				OR: [
					{ title: { contains: search, mode: "insensitive" } },
					{ content: { contains: search, mode: "insensitive" } },
				],
			}),
			// Filter by tag if provided
			...(tagId && {
				noteTags: { some: { tagId } },
			}),
		},
		select: noteWithTags,
		orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
	});

	return notes.map(formatNote);
};

export const getNoteById = async (userId: string) => {
	const notes = await prisma.notes.findMany({
		where: {
			userId,
			isArchived: true,
		},
		select: noteWithTags,
		orderBy: {
			updatedAt: "desc",
		},
	});

	return notes.map(formatNote);
};

// Create a note and optionally attach tags in one transaction
export const createNote = async (
	userId: string,
	{ title, content, tag_ids }: CreateNoteDTO,
) => {
	const note = await prisma.notes.create({
		data: {
			userId,
			title,
			content,
			...(tag_ids?.length && {
				noteTags: {
					create: tag_ids.map((tagId) => ({ tagId })),
				},
			}),
		},
		select: noteWithTags,
	});

	return formatNote(note);
};

// Update note fields and/or replace tags
export const updateNote = async (
	noteId: string,
	userId: string,
	{ title, content, is_pinned, is_archived, tag_ids }: UpdateNoteDTO,
) => {
	const existing = await prisma.notes.findFirst({
		where: { id: noteId, userId },
	});

	if (!existing) return null;

	const note = await prisma.notes.update({
		where: { id: noteId },
		data: {
			...(title !== undefined && { title }),
			...(content !== undefined && { content }),
			...(is_pinned !== undefined && { isPinned: is_pinned }),
			...(is_archived !== undefined && { isArchived: is_archived }),
			...(tag_ids !== undefined && {
				noteTags: {
					deleteMany: {},
					create: tag_ids.map((tagId) => ({ tagId })),
				},
			}),
		},
		select: noteWithTags,
	});

	return formatNote(note);
};

// delete a note
export const deleteNote = async (noteId: string, userId: string) => {
	const existingNote = await prisma.notes.findFirst({ where: noteId, userId });

	if (!existingNote) return false;

	await prisma.notes.delete({ where: { id: noteId } });

	return true;
};

// Get archived notes separately
export const getArchivedNotes = async (userId: string) => {
	const notes = await prisma.notes.findMany({
		where: { userId, isArchived: true },
		select: noteWithTags,
		orderBy: { updatedAt: "desc" },
	});

	return notes.map(formatNote);
};
