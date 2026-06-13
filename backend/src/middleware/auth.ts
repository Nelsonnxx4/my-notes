import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";

interface JwtPayload {
	id: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ message: "No token provided" });
		return;
	}

	const token = authHeader.split(" ")[1];

	const isBlacklisted = await redisClient.get(`blacklist:${token}`);
	if (isBlacklisted) {
		res.status(401).json({ message: "Token has been revoked" });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		req.user = decoded;
		next();
	} catch {
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
