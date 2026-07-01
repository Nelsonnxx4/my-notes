import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import EditorHeader from "@/components/editor/EditorHeader";
import NoteTitleInput from "@/components/editor/NoteTitleInput";
import NoteContentEditor from "@/components/editor/NoteContentEditor";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ColorPicker from "@/components/editor/ColorPicker";
import { useNote } from "@/hooks/queries/useNotes";
import { useAutoSaveNote } from "@/hooks/mutations/useAutoSaveNote";

const AUTOSAVE_MS = 800;

const NoteDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: note, isLoading } = useNote(id!);
  const { mutate: autoSave, isPending: isSaving } = useAutoSaveNote();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content ?? "");
    }
  }, [note?.id]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSave = useCallback(
    (nextTitle: string, nextContent: string) => {
      if (!id) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        autoSave({ id, payload: { title: nextTitle, content: nextContent } });
      }, AUTOSAVE_MS);
    },
    [id, autoSave],
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    scheduleSave(val, content);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    scheduleSave(title, val);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7FA]">
        <Loader2 className="animate-spin text-green-400" size={28} />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7FA]">
        <p className="text-gray-400">Note not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-36" style={{ backgroundColor: bgColor }}>
      <EditorHeader isSaving={isSaving} note={note} />

      <div className="px-5">
        <ColorPicker value={bgColor} onChange={setBgColor} />
        <NoteTitleInput value={title} onChange={handleTitleChange} />
        <NoteContentEditor value={content} onChange={handleContentChange} />
      </div>

      <EditorToolbar />
    </main>
  );
};

export default NoteDetailsPage;
