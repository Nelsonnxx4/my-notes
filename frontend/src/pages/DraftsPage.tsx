import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, FileText, PenLine, Trash2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import {
  clearCreateNoteDraft,
  getCreateNoteDraftKey,
  readCreateNoteDraft,
  type CreateNoteDraft,
} from "@/utils/createNoteDraft";
import { textFromHtml } from "@/utils/editorHtml";

function formatSavedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Saved recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const DraftsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const draftKey = useMemo(() => getCreateNoteDraftKey(user?.id), [user?.id]);
  const [draft, setDraft] = useState<CreateNoteDraft | null>(() =>
    readCreateNoteDraft(draftKey),
  );

  const preview = draft ? textFromHtml(draft.contentHtml).trim() : "";

  useEffect(() => {
    setDraft(readCreateNoteDraft(draftKey));
  }, [draftKey]);

  function deleteDraft() {
    clearCreateNoteDraft(draftKey);
    setDraft(null);
  }

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 pt-20 pb-28 md:pt-32 dark:bg-gray-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Drafts</h1>
        <p className="text-sm text-gray-400 mt-0.5 dark:text-gray-500">
          Resume notes you started but have not saved yet.
        </p>
      </div>

      {!draft && (
        <div className="flex flex-col items-center py-24 text-center">
          <FileText
            className="text-gray-200 mb-4 dark:text-gray-800"
            size={48}
            strokeWidth={1}
          />
          <p className="text-gray-500 font-medium dark:text-gray-400">No drafts yet</p>
          <button
            className="mt-4 text-green-600 text-sm font-medium hover:underline"
            type="button"
            onClick={() => navigate("/create")}
          >
            Start a note
          </button>
        </div>
      )}

      {draft && (
        <article className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
                <Clock3 size={13} strokeWidth={1.7} />
                {formatSavedAt(draft.updatedAt)}
              </p>
              <h2 className="truncate text-xl font-semibold text-gray-800 dark:text-gray-100">
                {draft.title.trim() || "Untitled Note"}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {preview || "No note body yet."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                {draft.selectedFolderId && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-900 dark:text-gray-300">
                    Folder selected
                  </span>
                )}
                {draft.selectedTagIds.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-900 dark:text-gray-300">
                    {draft.selectedTagIds.length} tag
                    {draft.selectedTagIds.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600/85"
              type="button"
              onClick={() => navigate("/create")}
            >
              <PenLine size={15} strokeWidth={1.8} />
              Resume draft
            </button>
            <button
              className="flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/30"
              type="button"
              onClick={deleteDraft}
            >
              <Trash2 size={15} strokeWidth={1.8} />
              Delete
            </button>
          </div>
        </article>
      )}
    </main>
  );
};

export default DraftsPage;
