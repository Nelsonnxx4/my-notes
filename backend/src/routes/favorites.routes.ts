import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { getFavoriteNotes, updateNote } from "../services/notes.service";

const router = Router();

router.use(protect);

// GET /api/favorites
router.get("/", async (req: Request, res: Response) => {
	const notes = await getFavoriteNotes(req.user!.id);
	res.status(200).json(notes);
});

// POST /api/favorites/:noteId
router.post("/:noteId", async (req: Request, res: Response) => {
	const noteId = Array.isArray(req.params.noteId)
		? req.params.noteId[0]
		: req.params.noteId;
	const note = await updateNote(noteId, req.user!.id, {
		is_favorite: true,
	});
	if (!note) {
		res.status(404).json({ message: "ahhh Note not found" });
		return;
	}
	res.status(200).json({ message: "Added to favorites", note });
});

// DELETE /api/favorites/:noteId
router.delete("/:noteId", async (req: Request, res: Response) => {
	const noteId = Array.isArray(req.params.noteId)
		? req.params.noteId[0]
		: req.params.noteId;
	const note = await updateNote(noteId, req.user!.id, {
		is_favorite: false,
	});
	if (!note) {
		res.status(404).json({ message: "ahhh Note not found" });
		return;
	}
	res.status(200).json({ message: "Removed from favorites", note });
});

export default router;
