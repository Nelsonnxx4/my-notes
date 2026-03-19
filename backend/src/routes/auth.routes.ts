// backend/src/routes/auth.routes.ts
import { Router, Request, Response } from "express";
import { registerUser, loginUser, getUserById } from "../services/auth.service";
import { protect } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const result = await registerUser({ email, password });

    res.status(201).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";

    res.status(400).json({ message });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const result = await loginUser({ email, password });

    res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";

    res.status(401).json({ message });
  }
});

// GET /api/auth/me  — get current logged in user
router.get("/me", protect, async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user!.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
