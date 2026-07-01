import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useCreateNote } from "@/hooks/mutations/useCreateNote";

const CreateNotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createNote, isPending } = useCreateNote();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");

      return;
    }
    setError(null);
    createNote({ title: title.trim(), content: content.trim() });
  }

  return (
    <main className="min-h-screen bg-[#F7F7FA] pb-36">
      <header className="flex items-center justify-between p-5">
        <button
          aria-label="Go back"
          className="rounded-full bg-white p-3 shadow-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>

        <button
          className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600/85 disabled:opacity-50 transition cursor-pointer"
          disabled={isPending || !title.trim()}
          onClick={handleSubmit}
        >
          {isPending && <Loader2 className="animate-spin" size={14} />}
          Save
        </button>
      </header>

      <div className="px-5 space-y-4">
        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <textarea
          className="w-full resize-none bg-transparent text-4xl font-bold outline-none leading-tight"
          placeholder="Untitled Note"
          rows={2}
          value={title}
          onChange={(e) => {
            setError(null);
            setTitle(e.target.value);
          }}
        />

        <textarea
          className="w-full min-h-[60vh] resize-none bg-transparent text-base leading-8 outline-none"
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </main>
  );
};

export default CreateNotesPage;
