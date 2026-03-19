// backend/src/types/index.ts

export interface User {
  id: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_archived: boolean;
  search_index?: string;
  created_at: Date;
  updated_at: Date;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  user_id: string;
}

export interface NoteTag {
  note_id: string;
  tag_id: number;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  tag_ids?: number[];
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  tag_ids?: number[];
}

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Extends Express Request to carry authenticated user
export interface AuthRequest extends Express.Request {
  user?: { id: string; email: string };
}
