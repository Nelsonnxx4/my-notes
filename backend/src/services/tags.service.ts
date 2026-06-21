import prisma from "../config/prisma";

export const getTagsByUser = async (userId: string) => {
	const tags = await prisma.tags.findMany({
		where: { userId },
		select: {
			id: true,
			name: true,
			userId: true,
			_count: { select: { noteTags: true } },
		},
		orderBy: { name: "asc" },
	});

	return tags.map(
		({
			_count,
			...tag
		}: {
			_count: { noteTags: number };
			id: number;
			name: string;
			userId: string;
		}) => ({
			...tag,
			noteCount: _count.noteTags,
		}),
	);
};

export const createTag = async (userId: string, name: string) => {
	return prisma.tags.create({
		data: { name: name.trim(), userId },
		select: { id: true, name: true, userId: true },
	});
};

export const updateTag = async (
	tagId: number,
	userId: string,
	name: string,
) => {
	const existing = await prisma.tags.findFirst({
		where: { id: tagId, userId },
	});

	if (!existing) return null;

	return prisma.tags.update({
		where: { id: tagId },
		data: { name: name.trim() },
		select: { id: true, name: true, userId: true },
	});
};

export const deleteTag = async (tagId: number, userId: string) => {
	const existing = await prisma.tags.findFirst({
		where: { id: tagId, userId },
	});

	if (!existing) return false;

	await prisma.tags.delete({ where: { id: tagId } });

	return true;
};
