import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Tag {
  id: number;
  name: string;
  user_id: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag_ids?: number[];
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  tag_ids?: number[];
}
