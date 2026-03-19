import query from "../db/notes.db";

export const getNotes = async () => {
  const { rows } = await query("SELECT * FROM notes");
  return rows;
};
