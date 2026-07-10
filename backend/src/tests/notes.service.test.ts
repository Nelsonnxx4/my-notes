import { createNote, getNotesByUser } from "../services/notes.service";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
	__esModule: true,
	default: {
		notes: {
			create: jest.fn(),
			findMany: jest.fn(),
		},
	},
}));

const mockNotes = prisma.notes as unknown as {
	create: jest.Mock;
	findMany: jest.Mock;
};

const baseNote = {
	id: "note-1",
	userId: "user-1",
	title: "Test",
	content: "",
	isPinned: false,
	isArchived: false,
	isFavorite: false,
	folderId: null,
	createdAt: new Date(),
	updatedAt: new Date(),
	noteTags: [{ tag: { id: 1, name: "work" } }],
};

test("createNote returns a formatted note with tags array", async () => {
	mockNotes.create.mockResolvedValue(baseNote);

	const note = await createNote("user-1", { title: "Test" }) as Record<string, unknown>;

	expect(note["title"]).toBe("Test");
	expect(note["tags"]).toEqual([{ id: 1, name: "work" }]);
});

test("getNotesByUser returns formatted notes for a user", async () => {
	mockNotes.findMany.mockResolvedValue([baseNote]);

	const notes = await getNotesByUser("user-1") as Record<string, unknown>[];

	expect(notes).toHaveLength(1);
	expect(notes[0]?.["title"]).toBe("Test");
	expect(notes[0]?.["tags"]).toEqual([{ id: 1, name: "work" }]);
});

test("getNotesByUser filters by search term via findMany call", async () => {
	mockNotes.findMany.mockResolvedValue([]);

	await getNotesByUser("user-1", "hello");

	expect(mockNotes.findMany).toHaveBeenCalledWith(
		expect.objectContaining({
			where: expect.objectContaining({
				OR: expect.arrayContaining([
					expect.objectContaining({ title: expect.objectContaining({ contains: "hello" }) }),
				]),
			}),
		}),
	);
});
