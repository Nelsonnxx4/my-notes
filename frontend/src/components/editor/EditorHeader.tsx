import { ArrowLeft, Pin, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Note } from "@/types";
import { deleteNote, updateNote } from "@/api/notes.api";

interface Props {
  note: Note;
  isSaving: boolean;
}

const EditorHeader = ({ note, isSaving }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: remove } = useMutation({
    mutationFn: () => deleteNote(note.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate(-1);
    },
  });

  const { mutate: togglePin } = useMutation({
    mutationFn: () => updateNote(note.id, { is_pinned: !note.isPinned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note", note.id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <header className="flex items-center justify-between p-5">
      <button
        aria-label="Go back"
        className="rounded-full bg-white p-3"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        {isSaving && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Loader2 className="animate-spin" size={12} />
            Saving…
          </span>
        )}

        <button
          aria-label={note.isPinned ? "Unpin note" : "Pin note"}
          className={`rounded-full p-3 transition ${
            note.isPinned
              ? "bg-green-400 text-white"
              : "bg-white text-gray-500 hover:text-green-500"
          }`}
          onClick={() => togglePin()}
        >
          <Pin size={18} strokeWidth={1.5} />
        </button>

        <button
          aria-label="Delete note"
          className="rounded-full bg-white p-3 text-gray-500 hover:text-red-500 transition"
          onClick={() => {
            if (confirm("Delete this note? This cannot be undone.")) remove();
          }}
        >
          <Trash2 size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
};

export default EditorHeader;
