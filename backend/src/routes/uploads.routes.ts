import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Router, Request, Response } from "express";
import multer from "multer";
import { protect } from "../middleware/auth";
import { HttpError } from "../errors/httpError";

const router = Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
});

const ALLOWED_IMAGE_TYPES = new Map([
	["image/jpeg", "jpg"],
	["image/png", "png"],
	["image/webp", "webp"],
	["image/gif", "gif"],
]);

const getUploadRoot = () =>
	path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"));

const getPublicBaseUrl = (req: Request) =>
	(process.env.PUBLIC_API_URL?.replace(/\/$/, "") ??
		`${req.protocol}://${req.get("host")}`);

router.use(protect);

router.post(
	"/images",
	upload.single("image"),
	async (req: Request, res: Response) => {
		const file = req.file;

		if (!file) {
			throw new HttpError("Image file is required", 400);
		}

		const extension = ALLOWED_IMAGE_TYPES.get(file.mimetype);

		if (!extension) {
			throw new HttpError("Only JPEG, PNG, WebP, and GIF images are allowed", 400);
		}

		const userDirName = req.user!.id.replace(/[^a-zA-Z0-9_-]/g, "");
		const fileName = `${randomUUID()}.${extension}`;
		const uploadDir = path.join(getUploadRoot(), userDirName);
		const filePath = path.join(uploadDir, fileName);

		await mkdir(uploadDir, { recursive: true });
		await writeFile(filePath, file.buffer);

		const publicPath = `/uploads/${userDirName}/${fileName}`;

		res.status(201).json({
			url: `${getPublicBaseUrl(req)}${publicPath}`,
			path: publicPath,
			originalName: file.originalname,
			size: file.size,
			mimeType: file.mimetype,
		});
	},
);

export default router;
