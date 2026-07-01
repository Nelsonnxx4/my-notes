import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Tag {
  id: number;
  name: string;
  userId?: string;
  noteCount?: number;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag_ids?: number[];
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  tag_ids?: number[];
}
