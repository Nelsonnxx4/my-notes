process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../index";

const token = jwt.sign(
	{ id: "user-1", email: "test@example.com" },
	"test-secret",
	{ expiresIn: "1h" },
);

jest.mock("../services/notes.service", () => ({
	getNotesByUser: jest
		.fn()
		.mockResolvedValue([
			{ id: "note-1", title: "Note 1", content: "", tags: [], isPinned: false, isFavorite: false, isArchived: false, userId: "user-1", folderId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
		]),
	createNote: jest.fn().mockResolvedValue({
		id: "note-2",
		title: "New Note",
		content: "",
		tags: [],
		isPinned: false,
		isFavorite: false,
		isArchived: false,
		userId: "user-1",
		folderId: null,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}),
	getArchivedNotes: jest.fn().mockResolvedValue([]),
	getNoteById: jest.fn().mockResolvedValue(null),
	updateNote: jest.fn().mockResolvedValue(null),
	deleteNote: jest.fn().mockResolvedValue(false),
}));

jest.mock("../config/redis", () => ({
	__esModule: true,
	default: { isOpen: false },
}));

test("GET /api/notes returns notes for authenticated user", async () => {
	const res = await request(app)
		.get("/api/notes")
		.set("Authorization", `Bearer ${token}`);

	expect(res.status).toBe(200);
	expect(res.body[0].title).toBe("Note 1");
});

test("POST /api/notes creates a note for authenticated user", async () => {
	const res = await request(app)
		.post("/api/notes")
		.set("Authorization", `Bearer ${token}`)
		.send({ title: "New Note" });

	expect(res.status).toBe(201);
	expect(res.body.title).toBe("New Note");
});

test("GET /api/notes returns 401 for unauthenticated request", async () => {
	const res = await request(app).get("/api/notes");

	expect(res.status).toBe(401);
});
