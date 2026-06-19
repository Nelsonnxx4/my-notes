import { Request, Response, NextFunction } from "express";
import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/client";

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	console.error("[Error]", err.message);

	if (err instanceof PrismaClientKnownRequestError) {
		switch (err.code) {
			case "P2002": {
				const field = (err.meta?.target as string[])?.join(", ") ?? "field";
				res
					.status(409)
					.json({ message: `A record with this ${field} already exists` });
				return;
			}
			case "P2025":
				res.status(404).json({ message: "Record not found" });
				return;
			case "P2003":
				res.status(400).json({ message: "Related record not found" });
				return;
			default:
				res.status(400).json({ message: "Database error", code: err.code });
				return;
		}
	}

	if (err instanceof PrismaClientValidationError) {
		res.status(400).json({ message: "Invalid data provided" });
		return;
	}

	// JWT or custom app errors
	if (err.message) {
		res.status(400).json({ message: err.message });
		return;
	}

	res.status(500).json({ message: "Internal server error" });
};
