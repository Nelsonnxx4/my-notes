const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on("connect", () => {
	console.log("Connected to Neon db");
});

pool.on("error", (err: Error) => {
	console.error("Unexpected database error:", err);
});

module.exports = { pool };
