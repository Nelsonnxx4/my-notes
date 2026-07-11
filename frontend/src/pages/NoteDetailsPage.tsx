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
import { useEditorActions } from "@/hooks/useEditorActions";
import { useAppearance } from "@/contexts/AppearanceContext";

function parseStats(html: string) {
  const text =
    new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = Math.max(
    1,
    (html.match(/<br|<\/p>|<\/li>|<\/h[1-6]>/gi) ?? []).length + 1,
  );
  return { words, chars: text.length, lines };
}

const AUTOSAVE_MS = 800;

const NoteDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: note, isLoading } = useNote(id!);
  const { mutate: autoSave, isPending: isSaving } = useAutoSaveNote();
  const { showWordCount, lineNumbers } = useAppearance();

  const [title, setTitle] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [stats, setStats] = useState({ words: 0, chars: 0, lines: 1 });

  const editorRef = useRef<HTMLDivElement>(null);
  const { execFormat, insertImage } = useEditorActions(editorRef);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
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
    scheduleSave(val, editorRef.current?.innerHTML ?? "");
  };

  const handleContentChange = (html: string) => {
    scheduleSave(title, html);
    if (showWordCount || lineNumbers) setStats(parseStats(html));
  };

  useEffect(() => {
    if (note?.content) setStats(parseStats(note.content));
  }, [note?.id]);

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
    <main
      className="min-h-screen pt-20 pb-32 md:pt-32 md:pb-20"
      style={{ backgroundColor: bgColor }}
    >
      <EditorHeader isSaving={isSaving} note={note} />

      <div className="px-5">
        <ColorPicker value={bgColor} onChange={setBgColor} />
        <NoteTitleInput value={title} onChange={handleTitleChange} />
        <NoteContentEditor
          ref={editorRef}
          defaultContent={note.content ?? ""}
          onChange={handleContentChange}
        />

        {(showWordCount || lineNumbers) && (
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
            {showWordCount && (
              <>
                <span>
                  {stats.words} {stats.words === 1 ? "word" : "words"}
                </span>
                <span>
                  {stats.chars} {stats.chars === 1 ? "char" : "chars"}
                </span>
              </>
            )}
            {lineNumbers && (
              <span>
                {stats.lines} {stats.lines === 1 ? "line" : "lines"}
              </span>
            )}
          </div>
        )}
      </div>

      <EditorToolbar execFormat={execFormat} onInsertImage={insertImage} />
    </main>
  );
};

export default NoteDetailsPage;
