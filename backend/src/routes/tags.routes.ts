// backend/src/routes/tags.routes.ts
import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import {
  getTagsByUser,
  createTag,
  updateTag,
  deleteTag,
} from "../services/tags.service";

const router = Router();

router.use(protect);

// GET /api/tags
router.get("/", async (req: Request, res: Response) => {
  try {
    const tags = await getTagsByUser(req.user!.id);

    res.status(200).json(tags);
  } catch {
    res.status(500).json({ message: "Failed to fetch tags" });
  }
});

// POST /api/tags
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Tag name is required" });
      return;
    }

    const tag = await createTag(req.user!.id, name);

    res.status(201).json(tag);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create tag";

    res.status(400).json({ message });
  }
});

// PATCH /api/tags/:id
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Tag name is required" });
      return;
    }

    const tag = await updateTag(Number(req.params.id), req.user!.id, name);

    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json(tag);
  } catch {
    res.status(500).json({ message: "Failed to update tag" });
  }
});

// DELETE /api/tags/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await deleteTag(Number(req.params.id), req.user!.id);

    if (!deleted) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete tag" });
  }
});

export default router;
