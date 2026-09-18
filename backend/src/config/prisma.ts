import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 5,
	idleTimeoutMillis: 120_000,
	connectionTimeoutMillis: 30_000,
});

pool.on("error", (err) => {
	console.error("[DB] Idle client error:", err.message);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
