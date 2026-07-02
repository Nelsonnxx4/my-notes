import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createFolderSchema, updateFolderSchema } from "../schemas";
import {
	getFoldersByUser,
	getFolderById,
	createFolder,
	updateFolder,
	deleteFolder,
	moveNoteToFolder,
} from "../services/folders.service";

const router = Router();

router.use(protect);

// GET /api/folders
router.get("/", async (req: Request, res: Response) => {
	const folders = await getFoldersByUser(req.user!.id);
	res.status(200).json(folders);
});

// GET /api/folders/:id
router.get("/:id", async (req: Request, res: Response) => {
	const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
	if (!id) {
		res.status(400).json({ message: "Invalid folder id" });
		return;
	}
	const folder = await getFolderById(id, req.user!.id);
	if (!folder) {
		res.status(404).json({ message: "Folder not found" });
		return;
	}
	res.status(200).json(folder);
});

// POST /api/folders
router.post(
	"/",
	validate(createFolderSchema),
	async (req: Request, res: Response) => {
		const result = await createFolder(req.user!.id, req.body);
		if ("error" in result) {
			res.status(409).json({ message: result.error });
			return;
		}
		res.status(201).json(result.data);
	},
);

// PATCH /api/folders/:id
router.patch(
	"/:id",
	validate(updateFolderSchema),
	async (req: Request, res: Response) => {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
		if (!id) {
			res.status(400).json({ message: "Invalid folder id" });
			return;
		}
		const folder = await updateFolder(id, req.user!.id, req.body);
		if (!folder) {
			res.status(404).json({ message: "Folder not found" });
			return;
		}
		res.status(200).json(folder);
	},
);

// DELETE /api/folders/:id
router.delete("/:id", async (req: Request, res: Response) => {
	const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
	if (!id) {
		res.status(400).json({ message: "Invalid folder id" });
		return;
	}
	const deleted = await deleteFolder(id, req.user!.id);
	if (!deleted) {
		res.status(404).json({ message: "Folder not found" });
		return;
	}
	res.status(200).json({ message: "Folder deleted successfully" });
});

// PATCH /api/folders/move/:noteId
router.patch("/move/:noteId", async (req: Request, res: Response) => {
	const noteId = Array.isArray(req.params.noteId)
		? req.params.noteId[0]
		: req.params.noteId;
	if (!noteId) {
		res.status(400).json({ message: "Invalid note id" });
		return;
	}
	const { folder_id } = req.body as { folder_id: string | null };
	const note = await moveNoteToFolder(noteId, folder_id ?? null, req.user!.id);
	if (!note) {
		res.status(404).json({ message: "Note or folder not found" });
		return;
	}
	res.status(200).json(note);
});

export default router;
