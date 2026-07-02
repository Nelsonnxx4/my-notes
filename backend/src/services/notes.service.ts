import prisma from "../config/prisma";
import type { CreateNoteDTO, UpdateNoteDTO } from "../types";

const noteWithTags = {
	id: true,
	userId: true,
	title: true,
	content: true,
	isPinned: true,
	isArchived: true,
	isFavorite: true,
	folderId: true,
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
			...(tagId && { noteTags: { some: { tagId } } }),
		},
		select: noteWithTags,
		orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
	});
	return notes.map(formatNote);
};

// FIXED: was using userId as noteId
export const getNoteById = async (noteId: string) => {
	const note = await prisma.notes.findUnique({
		where: { id: noteId },
		select: noteWithTags,
	});
	if (!note) return null;
	return formatNote(note);
};

export const getArchivedNotes = async (userId: string) => {
	const notes = await prisma.notes.findMany({
		where: { userId, isArchived: true },
		select: noteWithTags,
		orderBy: { updatedAt: "desc" },
	});
	return notes.map(formatNote);
};

export const getFavoriteNotes = async (userId: string) => {
	const notes = await prisma.notes.findMany({
		where: { userId, isFavorite: true, isArchived: false },
		select: noteWithTags,
		orderBy: { updatedAt: "desc" },
	});
	return notes.map(formatNote);
};

export const createNote = async (
	userId: string,
	{ title, content, tag_ids, folder_id }: CreateNoteDTO,
) => {
	const note = await prisma.notes.create({
		data: {
			userId,
			title,
			content,
			...(folder_id && { folderId: folder_id }),
			...(tag_ids?.length && {
				noteTags: { create: tag_ids.map((tagId) => ({ tagId })) },
			}),
		},
		select: noteWithTags,
	});
	return formatNote(note);
};

export const updateNote = async (
	noteId: string,
	userId: string,
	{
		title,
		content,
		is_pinned,
		is_archived,
		is_favorite,
		tag_ids,
		folder_id,
	}: UpdateNoteDTO,
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
			...(is_favorite !== undefined && { isFavorite: is_favorite }),
			...(folder_id !== undefined && { folderId: folder_id }),
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

export const deleteNote = async (noteId: string, userId: string) => {
	const existing = await prisma.notes.findFirst({
		where: { id: noteId, userId },
	});
	if (!existing) return false;

	await prisma.notes.delete({ where: { id: noteId } });
	return true;
};
