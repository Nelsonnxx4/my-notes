import { useState } from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useNotes } from "@/hooks/queries/useNotes";
import { deleteNote } from "@/api/notes.api";
import type { Note } from "@/types";

function stripHtml(html: string): string {
  return new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
}

function noteToMarkdown(note: Note): string {
  const title = `# ${note.title}`;
  const tags =
    note.tags && note.tags.length > 0
      ? `Tags: ${note.tags.map((t) => `#${t.name}`).join(" ")}`
      : "";
  const body = stripHtml(note.content ?? "");
  const updated = `_Updated: ${new Date(note.updatedAt).toLocaleString()}_`;

  return [title, tags, body, updated].filter(Boolean).join("\n\n");
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const DataSettings = () => {
  const { data: notes = [], isLoading } = useNotes();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function exportMarkdown() {
    const content = notes.map(noteToMarkdown).join("\n\n---\n\n");
    download("my-notes.md", content, "text/markdown");
  }

  function exportText() {
    const content = notes
      .map((n) => `${n.title}\n\n${stripHtml(n.content ?? "")}`)
      .join("\n\n---\n\n");
    download("my-notes.txt", content, "text/plain");
  }

  function exportJson() {
    const payload = notes.map((n) => ({
      id: n.id,
      title: n.title,
      content: stripHtml(n.content ?? ""),
      tags: n.tags?.map((t) => t.name) ?? [],
      isFavorite: n.isFavorite,
      isPinned: n.isPinned,
      isArchived: n.isArchived,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));
    download("my-notes.json", JSON.stringify(payload, null, 2), "application/json");
  }

  async function handleDeleteAll() {
    setDeleting(true);
    try {
      await Promise.all(notes.map((n) => deleteNote(n.id)));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  const exportOptions = [
    { fmt: "Markdown (.md)", desc: "Best for most apps", fn: exportMarkdown },
    { fmt: "Plain text (.txt)", desc: "Universal format", fn: exportText },
    { fmt: "JSON", desc: "For developers", fn: exportJson },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Export</h3>
        <p className="text-xs text-gray-400 mb-3">
          Download a copy of all your notes and folders.
        </p>
        <div className="space-y-2">
          {exportOptions.map(({ fmt, desc, fn }) => (
            <button
              key={fmt}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition group cursor-pointer disabled:opacity-50"
              disabled={isLoading || notes.length === 0}
              type="button"
              onClick={fn}
            >
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{fmt}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Download
                className="text-gray-300 group-hover:text-green-400 transition"
                size={15}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Storage</h3>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>
              {isLoading ? "…" : notes.length}{" "}
              {notes.length === 1 ? "note" : "notes"}
            </span>
            <span>Unlimited</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-400 transition-all"
              style={{ width: `${Math.min((notes.length / 200) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-red-500 mb-1">
          Danger zone
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          These actions are permanent and cannot be undone.
        </p>

        {!showConfirm ? (
          <button
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
            disabled={notes.length === 0}
            type="button"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 size={15} strokeWidth={1.5} />
            Delete all notes
          </button>
        ) : (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
            <p className="text-sm text-red-600 font-medium">
              Are you sure? This will permanently delete all {notes.length} notes.
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50 transition cursor-pointer"
                disabled={deleting}
                type="button"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                disabled={deleting}
                type="button"
                onClick={handleDeleteAll}
              >
                {deleting && (
                  <Loader2 className="animate-spin" size={14} strokeWidth={1.5} />
                )}
                {deleting ? "Deleting…" : "Yes, delete all"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSettings;
