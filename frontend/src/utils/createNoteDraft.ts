import {
  isEditorHtmlEmpty,
  sanitizeEditorHtml,
} from "@/utils/editorHtml";

export interface CreateNoteDraft {
  title: string;
  contentHtml: string;
  selectedFolderId: string | null;
  selectedTagIds: number[];
  updatedAt: string;
}

export const emptyCreateNoteDraft: CreateNoteDraft = {
  title: "",
  contentHtml: "",
  selectedFolderId: null,
  selectedTagIds: [],
  updatedAt: "",
};

export const getCreateNoteDraftKey = (userId?: string | null) =>
  `not-lify:create-note-draft:${userId ?? "guest"}`;

export function isCreateNoteDraftEmpty(draft: CreateNoteDraft): boolean {
  return (
    !draft.title.trim() &&
    isEditorHtmlEmpty(sanitizeEditorHtml(draft.contentHtml)) &&
    !draft.selectedFolderId &&
    draft.selectedTagIds.length === 0
  );
}

export function readCreateNoteDraft(key: string): CreateNoteDraft | null {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CreateNoteDraft>;
    const draft: CreateNoteDraft = {
      title: parsed.title ?? "",
      contentHtml: sanitizeEditorHtml(parsed.contentHtml ?? ""),
      selectedFolderId: parsed.selectedFolderId ?? null,
      selectedTagIds: Array.isArray(parsed.selectedTagIds)
        ? parsed.selectedTagIds.filter((id) => Number.isInteger(id))
        : [],
      updatedAt: parsed.updatedAt ?? "",
    };

    return isCreateNoteDraftEmpty(draft) ? null : draft;
  } catch {
    return null;
  }
}

export function writeCreateNoteDraft(
  key: string,
  draft: CreateNoteDraft,
): void {
  localStorage.setItem(key, JSON.stringify(draft));
}

export function clearCreateNoteDraft(key: string): void {
  localStorage.removeItem(key);
}
