// backend/src/services/google.service.ts
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (idToken: string) => {
  // Verify the token Google gave the frontend
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  const { email, name, sub: googleId } = payload;

  // Check if user already exists in your Postgres users table
  const existing = await pool.query(
    "SELECT id, email, created_at FROM users WHERE email = $1",
    [email]
  );

  let user;

  if (existing.rows.length > 0) {
    // User exists — just log them in
    user = existing.rows[0];
  } else {
    // New user — create them without a password (Google handles auth)
    const { rows } = await pool.query(
      `INSERT INTO users (email, password)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email, `GOOGLE_OAUTH_${googleId}`] // placeholder password
    );

    user = rows[0];
  }

  // Issue your own app JWT — same as regular login
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token, name };
};
