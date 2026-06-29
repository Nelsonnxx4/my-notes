export interface Note {
  id: string | number;
  title: string;
  content: string;
  color: string;
  coverImage?: string;
  tags: string[];
  folderId?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
