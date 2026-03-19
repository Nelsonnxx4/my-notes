import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import type { RegisterDTO, LoginDTO } from "../types";

export const registerUser = async ({ email, password }: RegisterDTO) => {
  // Check if email already exists
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  if (existing.rows.length > 0) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { rows } = await pool.query(
    `INSERT INTO users (email, password)
     VALUES ($1, $2)
     RETURNING id, email, created_at`,
    [email, hashedPassword]
  );

  const user = rows[0];
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  return { user, token };
};

export const loginUser = async ({ email, password }: LoginDTO) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Never return the password
  const { password: _pw, ...safeUser } = user;

  return { user: safeUser, token };
};

export const getUserById = async (id: string) => {
  const { rows } = await pool.query(
    "SELECT id, email, created_at FROM users WHERE id = $1",
    [id]
  );

  return rows[0] || null;
};
