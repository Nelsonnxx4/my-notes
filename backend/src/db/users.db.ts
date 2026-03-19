import pg from "pg";
import env from "dotenv";

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : undefined,
});
db.connect();

db.on("error", (err) => {
  console.error("unexpected error on idle client", err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => db.query(text, params);
