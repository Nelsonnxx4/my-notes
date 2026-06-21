import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTagSchema, updateTagSchema } from "../schemas";
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
	const tags = await getTagsByUser(req.user!.id);
	res.status(200).json(tags);
});

// POST /api/tags
router.post(
	"/",
	validate(createTagSchema),
	async (req: Request, res: Response) => {
		const tag = await createTag(req.user!.id, req.body.name);
		res.status(201).json(tag);
	},
);

// PATCH /api/tags/:id
router.patch(
	"/:id",
	validate(updateTagSchema),
	async (req: Request, res: Response) => {
		const tag = await updateTag(
			Number(req.params["id"] as string),
			req.user!.id,
			req.body.name,
		);

		if (!tag) {
			res.status(404).json({ message: "Tag not found" });
			return;
		}

		res.status(200).json(tag);
	},
);

// DELETE /api/tags/:id
router.delete("/:id", async (req: Request, res: Response) => {
	const deleted = await deleteTag(
		Number(req.params["id"] as string),
		req.user!.id,
	);

	if (!deleted) {
		res.status(404).json({ message: "Tag not found" });
		return;
	}

	res.status(200).json({ message: "Tag deleted successfully" });
});

export default router;
