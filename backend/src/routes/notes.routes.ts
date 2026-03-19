// backend/src/routes/notes.routes.ts
import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import {
  getNotesByUser,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getArchivedNotes,
} from "../services/notes.service";

const router = Router();

// All notes routes are protected
router.use(protect);

// GET /api/notes?q=search&tag=1
router.get("/", async (req: Request, res: Response) => {
  try {
    const search = req.query.q as string | undefined;
    const tag_id = req.query.tag ? Number(req.query.tag) : undefined;
    const notes = await getNotesByUser(req.user!.id, search, tag_id);

    res.status(200).json(notes);
  } catch {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// GET /api/notes/archived
router.get("/archived", async (req: Request, res: Response) => {
  try {
    const notes = await getArchivedNotes(req.user!.id);

    res.status(200).json(notes);
  } catch {
    res.status(500).json({ message: "Failed to fetch archived notes" });
  }
});

// GET /api/notes/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const note = await getNoteById(req.params.id, req.user!.id);

    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(note);
  } catch {
    res.status(500).json({ message: "Failed to fetch note" });
  }
});

// POST /api/notes
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, content, tag_ids } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const note = await createNote(req.user!.id, { title, content, tag_ids });

    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: "Failed to create note" });
  }
});

// PATCH /api/notes/:id
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { title, content, is_pinned, is_archived, tag_ids } = req.body;
    const note = await updateNote(req.params.id, req.user!.id, {
      title,
      content,
      is_pinned,
      is_archived,
      tag_ids,
    });

    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(note);
  } catch {
    res.status(500).json({ message: "Failed to update note" });
  }
});

// DELETE /api/notes/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await deleteNote(req.params.id, req.user!.id);

    if (!deleted) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete note" });
  }
});

export default router;
