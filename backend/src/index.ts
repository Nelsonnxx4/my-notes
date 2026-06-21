import express from "express";
<<<<<<< HEAD
import http from "http";
// import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
=======
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";
import tagsRoutes from "./routes/tags.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
>>>>>>> 2e47b235b5045e1e09c5a74fa5f787f112510202

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security & compression
app.use(compression());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
		credentials: true,
	}),
);
app.use(cookieParser());
<<<<<<< HEAD
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Hello</h1>`);
});
=======
>>>>>>> 2e47b235b5045e1e09c5a74fa5f787f112510202

// ── Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting
const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: "Too many requests, please try again later." },
});
<<<<<<< HEAD
=======

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: "Too many auth attempts, please try again later." },
});

app.use(globalLimiter);

// ── Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/tags", tagsRoutes);

// ── 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// ── Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
>>>>>>> 2e47b235b5045e1e09c5a74fa5f787f112510202
