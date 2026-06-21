import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerUser, loginUser, getUserById } from "../services/auth.service";
import { googleSignIn } from "../services/google.service";
import { registerSchema, loginSchema, googleAuthSchema } from "../schemas";

const router = Router();

// POST /api/auth/google
router.post(
	"/google",
	validate(googleAuthSchema),
	async (req: Request, res: Response) => {
		const result = await googleSignIn(req.body.idToken);
		res.status(200).json(result);
	},
);

// POST /api/auth/register
router.post(
	"/register",
	validate(registerSchema),
	async (req: Request, res: Response) => {
		const result = await registerUser(req.body);
		res.status(201).json(result);
	},
);

// POST /api/auth/login
router.post(
	"/login",
	validate(loginSchema),
	async (req: Request, res: Response) => {
		const result = await loginUser(req.body);
		res.status(200).json(result);
	},
);

// GET /api/auth/me
router.get("/me", protect, async (req: Request, res: Response) => {
	const user = await getUserById(req.user!.id);

	if (!user) {
		res.status(404).json({ message: "User not found" });
		return;
	}

	res.status(200).json(user);
});

export default router;
