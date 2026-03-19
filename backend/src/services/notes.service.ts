import pool from "../config/db";
import type { CreateNoteDTO, UpdateNoteDTO } from "../types";

export const getNotesByUser = async (
  user_id: string,
  search?: string,
  tag_id?: number
) => {
  let query = `
    SELECT
      n.id,
      n.user_id,
      n.title,
      n.content,
      n.is_pinned,
      n.is_archived,
      n.created_at,
      n.updated_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM notes n
    LEFT JOIN note_tags nt ON nt.note_id = n.id
    LEFT JOIN tags t       ON t.id = nt.tag_id
    WHERE n.user_id = $1
      AND n.is_archived = FALSE
  `;

  const params: (string | number)[] = [user_id];
  let paramIndex = 2;

  // Full-text search using the search_index tsvector column
  if (search) {
    query += ` AND n.search_index @@ plainto_tsquery('english', $${paramIndex})`;
    params.push(search);
    paramIndex++;
  }

  // Filter by tag
  if (tag_id) {
    query += ` AND nt.tag_id = $${paramIndex}`;
    params.push(tag_id);
    paramIndex++;
  }

  query += `
    GROUP BY n.id
    ORDER BY n.is_pinned DESC, n.updated_at DESC
  `;

  const { rows } = await pool.query(query, params);

  return rows;
};

export const getNoteById = async (note_id: string, user_id: string) => {
  const { rows } = await pool.query(
    `SELECT
       n.id,
       n.user_id,
       n.title,
       n.content,
       n.is_pinned,
       n.is_archived,
       n.created_at,
       n.updated_at,
       COALESCE(
         JSON_AGG(
           JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
         ) FILTER (WHERE t.id IS NOT NULL),
         '[]'
       ) AS tags
     FROM notes n
     LEFT JOIN note_tags nt ON nt.note_id = n.id
     LEFT JOIN tags t       ON t.id = nt.tag_id
     WHERE n.id = $1 AND n.user_id = $2
     GROUP BY n.id`,
    [note_id, user_id]
  );

  return rows[0] || null;
};

// Create a note and optionally attach tags in one transaction
export const createNote = async (
  user_id: string,
  { title, content, tag_ids }: CreateNoteDTO
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO notes (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, title, content]
    );

    const note = rows[0];

    // Attach tags if provided
    if (tag_ids && tag_ids.length > 0) {
      const tagValues = tag_ids.map((_, i) => `($1, $${i + 2})`).join(", ");

      await client.query(
        `INSERT INTO note_tags (note_id, tag_id) VALUES ${tagValues}`,
        [note.id, ...tag_ids]
      );
    }

    await client.query("COMMIT");

    // Return with tags populated
    return getNoteById(note.id, user_id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Update note fields and/or replace tags
export const updateNote = async (
  note_id: string,
  user_id: string,
  { title, content, is_pinned, is_archived, tag_ids }: UpdateNoteDTO
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Build dynamic SET clause for only provided fields
    const fields: string[] = [];
    const params: (string | boolean)[] = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      params.push(title);
    }
    if (content !== undefined) {
      fields.push(`content = $${idx++}`);
      params.push(content);
    }
    if (is_pinned !== undefined) {
      fields.push(`is_pinned = $${idx++}`);
      params.push(is_pinned);
    }
    if (is_archived !== undefined) {
      fields.push(`is_archived = $${idx++}`);
      params.push(is_archived);
    }

    if (fields.length > 0) {
      params.push(note_id, user_id);

      await client.query(
        `UPDATE notes SET ${fields.join(", ")}
         WHERE id = $${idx++} AND user_id = $${idx}`,
        params
      );
    }

    // Replace all tags if tag_ids is provided
    if (tag_ids !== undefined) {
      await client.query("DELETE FROM note_tags WHERE note_id = $1", [note_id]);

      if (tag_ids.length > 0) {
        const tagValues = tag_ids.map((_, i) => `($1, $${i + 2})`).join(", ");

        await client.query(
          `INSERT INTO note_tags (note_id, tag_id) VALUES ${tagValues}`,
          [note_id, ...tag_ids]
        );
      }
    }

    await client.query("COMMIT");

    return getNoteById(note_id, user_id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Hard delete a note (cascades to note_tags via FK)
export const deleteNote = async (note_id: string, user_id: string) => {
  const { rowCount } = await pool.query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2",
    [note_id, user_id]
  );

  return (rowCount ?? 0) > 0;
};

// Get archived notes separately
export const getArchivedNotes = async (user_id: string) => {
  const { rows } = await pool.query(
    `SELECT
       n.*,
       COALESCE(
         JSON_AGG(
           JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
         ) FILTER (WHERE t.id IS NOT NULL),
         '[]'
       ) AS tags
     FROM notes n
     LEFT JOIN note_tags nt ON nt.note_id = n.id
     LEFT JOIN tags t       ON t.id = nt.tag_id
     WHERE n.user_id = $1 AND n.is_archived = TRUE
     GROUP BY n.id
     ORDER BY n.updated_at DESC`,
    [user_id]
  );

  return rows;
};
