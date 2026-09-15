export class HttpError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
		public readonly details?: unknown,
	) {
		super(message);
	}
}

export class ConflictError extends HttpError {
	constructor(message: string, details?: unknown) {
		super(message, 409, details);
	}
}
