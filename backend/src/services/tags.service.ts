import pool from "../config/db";

// Get all tags belonging to a user
export const getTagsByUser = async (user_id: string) => {
  const { rows } = await pool.query(
    `SELECT t.id, t.name, t.user_id,
       COUNT(nt.note_id)::int AS note_count
     FROM tags t
     LEFT JOIN note_tags nt ON nt.tag_id = t.id
     WHERE t.user_id = $1
     GROUP BY t.id
     ORDER BY t.name ASC`,
    [user_id]
  );

  return rows;
};

export const createTag = async (user_id: string, name: string) => {
  const existing = await pool.query(
    "SELECT id FROM tags WHERE user_id = $1 AND LOWER(name) = LOWER($2)",
    [user_id, name]
  );

  if (existing.rows.length > 0) {
    throw new Error("Tag with this name already exists");
  }

  const { rows } = await pool.query(
    `INSERT INTO tags (name, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [name, user_id]
  );

  return rows[0];
};

export const deleteTag = async (tag_id: number, user_id: string) => {
  // note_tags rows are removed automatically via ON DELETE CASCADE
  const { rowCount } = await pool.query(
    "DELETE FROM tags WHERE id = $1 AND user_id = $2",
    [tag_id, user_id]
  );

  return (rowCount ?? 0) > 0;
};

export const updateTag = async (
  tag_id: number,
  user_id: string,
  name: string
) => {
  const { rows } = await pool.query(
    `UPDATE tags SET name = $1
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [name, tag_id, user_id]
  );

  return rows[0] || null;
};
