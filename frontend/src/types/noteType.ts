export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}
