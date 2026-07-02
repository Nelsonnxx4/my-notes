import prisma from "../config/prisma";
import type { CreateFolderDTO, UpdateFolderDTO } from "../types";

const folderSelect = {
	id: true,
	name: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
	_count: { select: { notes: true } },
} as const;

const formatFolder = (folder: {
	_count: { notes: number };
	id: string;
	name: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}) => {
	const { _count, ...rest } = folder;
	return { ...rest, noteCount: _count.notes };
};

export const getFoldersByUser = async (userId: string) => {
	const folders = await prisma.folder.findMany({
		where: { userId },
		select: folderSelect,
		orderBy: { updatedAt: "desc" },
	});
	return folders.map(formatFolder);
};

export const getFolderById = async (folderId: string, userId: string) => {
	const folder = await prisma.folder.findFirst({
		where: { id: folderId, userId },
		select: {
			...folderSelect,
			notes: {
				where: { isArchived: false },
				select: {
					id: true,
					title: true,
					content: true,
					isPinned: true,
					isFavorite: true,
					updatedAt: true,
					noteTags: {
						select: { tag: { select: { id: true, name: true } } },
					},
				},
				orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
			},
		},
	});

	if (!folder) return null;

	const { _count, notes, ...rest } = folder as typeof folder & {
		notes: any[];
	};

	return {
		...rest,
		noteCount: _count.notes,
		notes: notes.map(
			({ noteTags, ...note }: { noteTags: any[]; [key: string]: unknown }) => ({
				...note,
				tags: noteTags.map((nt: any) => nt.tag),
			}),
		),
	};
};

export const createFolder = async (
	userId: string,
	{ name }: CreateFolderDTO,
) => {
	const existing = await prisma.folder.findFirst({
		where: { userId, name: name.trim() },
	});
	if (existing) return { error: "You have a folder with this name already " };

	const folder = await prisma.folder.create({
		data: { name: name.trim(), userId },
		select: folderSelect,
	});
	return { data: formatFolder(folder) };
};

export const updateFolder = async (
	folderId: string,
	userId: string,
	{ name }: UpdateFolderDTO,
) => {
	const existing = await prisma.folder.findFirst({
		where: { id: folderId, userId },
	});
	if (!existing) return null;

	const folder = await prisma.folder.update({
		where: { id: folderId },
		data: { name: name.trim() },
		select: folderSelect,
	});
	return formatFolder(folder);
};

export const deleteFolder = async (folderId: string, userId: string) => {
	const existing = await prisma.folder.findFirst({
		where: { id: folderId, userId },
	});
	if (!existing) return false;

	await prisma.folder.delete({ where: { id: folderId } });
	return true;
};

// Move a note into or out of a folder
export const moveNoteToFolder = async (
	noteId: string,
	folderId: string | null,
	userId: string,
) => {
	const note = await prisma.notes.findFirst({ where: { id: noteId, userId } });
	if (!note) return null;

	if (folderId) {
		const folder = await prisma.folder.findFirst({
			where: { id: folderId, userId },
		});
		if (!folder) return null;
	}

	return prisma.notes.update({
		where: { id: noteId },
		data: { folderId },
		select: { id: true, folderId: true, title: true, updatedAt: true },
	});
};
