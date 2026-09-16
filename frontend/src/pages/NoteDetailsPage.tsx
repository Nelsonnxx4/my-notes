import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Editor } from "@tiptap/react";
import type { AxiosError } from "axios";

import EditorHeader from "@/components/editor/EditorHeader";
import NoteTitleInput from "@/components/editor/NoteTitleInput";
import NoteContentEditor from "@/components/editor/NoteContentEditor";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ColorPicker from "@/components/editor/ColorPicker";
import { useNote } from "@/hooks/queries/useNotes";
import { useAutoSaveNote } from "@/hooks/mutations/useAutoSaveNote";
import { useUploadEditorImage } from "@/hooks/useUploadEditorImage";
import { useAppearance } from "@/contexts/AppearanceContext";
import type { ApiErrorResponse, Note } from "@/types";
import { parseEditorStats, sanitizeEditorHtml } from "@/utils/editorHtml";

const AUTOSAVE_MS = 800;
const LIGHT_EDITOR_BG = "#FFFFFF";
const DARK_EDITOR_BG = "#101113";

const NoteDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: note, isLoading } = useNote(id!);
  const { mutate: autoSave, isPending: isSaving } = useAutoSaveNote();
  const { showWordCount, lineNumbers, theme } = useAppearance();

  const [title, setTitle] = useState<string>("");
  const [contentHtml, setContentHtml] = useState("");
  const [bgColor, setBgColor] = useState<string>(() =>
    document.documentElement.classList.contains("dark")
      ? DARK_EDITOR_BG
      : LIGHT_EDITOR_BG,
  );
  const [editor, setEditor] = useState<Editor | null>(null);
  const [savedVersion, setSavedVersion] = useState<number | null>(null);
  const [conflictNote, setConflictNote] = useState<Note | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [stats, setStats] = useState({ words: 0, chars: 0, lines: 1 });

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestVersion = useRef<number | null>(null);

  const handleImageError = useCallback((message: string) => {
    setSaveError(message);
  }, []);

  const { insertImage, isUploadingImage } = useUploadEditorImage(
    editor,
    handleImageError,
  );

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContentHtml(sanitizeEditorHtml(note.content ?? ""));
      setStats(parseEditorStats(note.content ?? ""));
      setConflictNote(null);
      setSaveError(null);
      latestVersion.current = note.version;
      setSavedVersion(note.version);
    }
  }, [note?.id]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  useEffect(() => {
    const nextDefault = document.documentElement.classList.contains("dark")
      ? DARK_EDITOR_BG
      : LIGHT_EDITOR_BG;

    setBgColor((current) =>
      current === LIGHT_EDITOR_BG ||
      current === DARK_EDITOR_BG ||
      current === "#030712"
        ? nextDefault
        : current,
    );
  }, [theme]);

  const handleAutoSaveError = useCallback(
    (err: AxiosError<ApiErrorResponse>) => {
      if (err.response?.status === 409) {
        const currentNote = err.response.data.details?.currentNote;

        if (currentNote) {
          setConflictNote(currentNote);
          setSaveError("This note changed somewhere else before autosave ran.");
          return;
        }
      }

      setSaveError(
        err.response?.data?.message ?? "Autosave failed. Your changes are still on screen.",
      );
    },
    [],
  );

  const scheduleSave = useCallback(
    (nextTitle: string, nextContent: string) => {
      if (!id || conflictNote) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const trimmedTitle = nextTitle.trim();
        const version = latestVersion.current;

        if (!trimmedTitle || !version) return;

        autoSave(
          {
            id,
            payload: {
              title: trimmedTitle,
              content: sanitizeEditorHtml(nextContent),
              version,
            },
          },
          {
            onSuccess: (savedNote) => {
              latestVersion.current = savedNote.version;
              setSavedVersion(savedNote.version);
              setSaveError(null);
            },
            onError: handleAutoSaveError,
          },
        );
      }, AUTOSAVE_MS);
    },
    [id, autoSave, conflictNote, handleAutoSaveError],
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    scheduleSave(val, contentHtml);
  };

  const handleContentChange = (html: string) => {
    setContentHtml(html);
    scheduleSave(title, html);
    if (showWordCount || lineNumbers) setStats(parseEditorStats(html));
  };

  const useServerCopy = () => {
    if (!conflictNote) return;

    const nextContent = sanitizeEditorHtml(conflictNote.content ?? "");

    setTitle(conflictNote.title);
    setContentHtml(nextContent);
    setStats(parseEditorStats(nextContent));
    latestVersion.current = conflictNote.version;
    setSavedVersion(conflictNote.version);
    setConflictNote(null);
    setSaveError(null);
  };

  const overwriteServerCopy = () => {
    if (!id || !conflictNote) return;

    autoSave(
      {
        id,
        payload: {
          title: title.trim() || conflictNote.title,
          content: sanitizeEditorHtml(contentHtml),
          version: conflictNote.version,
        },
      },
      {
        onSuccess: (savedNote) => {
          latestVersion.current = savedNote.version;
          setSavedVersion(savedNote.version);
          setConflictNote(null);
          setSaveError(null);
        },
        onError: handleAutoSaveError,
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7FA] dark:bg-gray-950">
        <Loader2 className="animate-spin text-green-400" size={28} />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7FA] dark:bg-gray-950">
        <p className="text-gray-400 dark:text-gray-500">Note not found.</p>
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
        {saveError && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 shrink-0" size={16} />
              <div className="flex-1">
                <p>{saveError}</p>
                {conflictNote && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100 dark:bg-gray-950 dark:text-amber-200 dark:ring-amber-900/60 dark:hover:bg-amber-950/40"
                      type="button"
                      onClick={useServerCopy}
                    >
                      Use server copy
                    </button>
                    <button
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                      type="button"
                      onClick={overwriteServerCopy}
                    >
                      Overwrite with mine
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <NoteTitleInput value={title} onChange={handleTitleChange} />
        <NoteContentEditor
          value={contentHtml}
          onChange={handleContentChange}
          onEditorReady={setEditor}
        />

        {(showWordCount || lineNumbers) && (
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
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
            {savedVersion && <span>v{savedVersion}</span>}
          </div>
        )}
      </div>

      <EditorToolbar
        editor={editor}
        isUploadingImage={isUploadingImage}
        onInsertImage={insertImage}
      />
    </main>
  );
};

export default NoteDetailsPage;
