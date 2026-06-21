import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createNoteSchema, updateNoteSchema } from "../schemas";
import {
	getNotesByUser,
	getNoteById,
	createNote,
	updateNote,
	deleteNote,
	getArchivedNotes,
} from "../services/notes.service";

const router = Router();

router.use(protect);

// GET /api/notes?q=search&tag=1
router.get("/", async (req: Request, res: Response) => {
	const search = typeof req.query.q === "string" ? req.query.q : undefined;
	const tagId =
		typeof req.query.tag === "string" ? Number(req.query.tag) : undefined;

	const notes = await getNotesByUser(req.user!.id, search, tagId);

	res.status(200).json(notes);
});

// GET /api/notes/archived
router.get("/archived", async (req: Request, res: Response) => {
	const notes = await getArchivedNotes(req.user!.id);

	res.status(200).json(notes);
});

// GET /api/notes/:id
router.get("/:id", async (req: Request, res: Response) => {
	const note = await getNoteById(req.params["id"] as string);

	if (!note) {
		res.status(404).json({ message: "Note not found" });
		return;
	}

	res.status(200).json(note);
});

// POST /api/notes
router.post(
	"/",
	validate(createNoteSchema),
	async (req: Request, res: Response) => {
		const note = await createNote(req.user!.id, req.body);
		res.status(201).json(note);
	},
);

// PATCH /api/notes/:id
router.patch(
	"/:id",
	validate(updateNoteSchema),
	async (req: Request, res: Response) => {
		const note = await updateNote(
			req.params["id"] as string,
			req.user!.id,
			req.body,
		);

		if (!note) {
			res.status(404).json({ message: "Note not found" });
			return;
		}

		res.status(200).json(note);
	},
);

// DELETE /api/notes/:id
router.delete("/:id", async (req: Request, res: Response) => {
	const deleted = await deleteNote(req.params["id"] as string, req.user!.id);

	if (!deleted) {
		res.status(404).json({ message: "Note not found" });
		return;
	}

	res.status(200).json({ message: "Note deleted successfully" });
});

export default router;
