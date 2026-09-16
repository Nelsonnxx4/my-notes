import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, FolderOpen, Tag, X, Plus, Trash2 } from "lucide-react";
import type { Editor } from "@tiptap/react";

import { useCreateNote } from "@/hooks/mutations/useCreateNote";
import { useFolders, useCreateFolder } from "@/hooks/useFolder";
import { useTags, useCreateTag } from "@/hooks/useTags";
import { useUploadEditorImage } from "@/hooks/useUploadEditorImage";
import { useAuth } from "@/contexts/AuthContext";
import EditorToolbar from "@/components/editor/EditorToolbar";
import NoteContentEditor from "@/components/editor/NoteContentEditor";
import { useAppearance } from "@/contexts/AppearanceContext";
import {
  isEditorHtmlEmpty,
  parseEditorStats,
  sanitizeEditorHtml,
} from "@/utils/editorHtml";
import {
  clearCreateNoteDraft,
  emptyCreateNoteDraft,
  getCreateNoteDraftKey,
  isCreateNoteDraftEmpty,
  readCreateNoteDraft,
  writeCreateNoteDraft,
  type CreateNoteDraft,
} from "@/utils/createNoteDraft";
import { notify } from "@/utils/toast";

const CreateNotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createNote, isPending } = useCreateNote();
  const { user } = useAuth();
  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();
  const { mutate: createFolder, isPending: isCreatingFolder } = useCreateFolder();
  const { mutate: createTag, isPending: isCreatingTag } = useCreateTag();
  const { showWordCount, lineNumbers } = useAppearance();

  const [title, setTitle] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [stats, setStats] = useState({ words: 0, chars: 0, lines: 1 });
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  const folderPickerRef = useRef<HTMLDivElement>(null);
  const tagPickerRef = useRef<HTMLDivElement>(null);
  const loadedDraftKey = useRef<string | null>(null);
  const skipNextDraftSave = useRef(false);
  const draftToastShown = useRef(false);
  const draftKey = getCreateNoteDraftKey(user?.id);

  const handleImageError = useCallback((message: string) => {
    notify({
      title: "Image upload failed",
      description: message,
      severity: "danger",
    });
  }, []);
  const { insertImage, isUploadingImage } = useUploadEditorImage(
    editor,
    handleImageError,
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        folderPickerRef.current &&
        !folderPickerRef.current.contains(e.target as Node)
      ) {
        setShowFolderPicker(false);
      }
      if (
        tagPickerRef.current &&
        !tagPickerRef.current.contains(e.target as Node)
      ) {
        setShowTagPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    skipNextDraftSave.current = true;
    const draft = readCreateNoteDraft(draftKey);

    if (draft) {
      setTitle(draft.title);
      setContentHtml(draft.contentHtml);
      setSelectedFolderId(draft.selectedFolderId);
      setSelectedTagIds(draft.selectedTagIds);
      setStats(parseEditorStats(draft.contentHtml));
      setDraftSavedAt(draft.updatedAt || null);
      draftToastShown.current = true;
    } else {
      setTitle(emptyCreateNoteDraft.title);
      setContentHtml(emptyCreateNoteDraft.contentHtml);
      setSelectedFolderId(emptyCreateNoteDraft.selectedFolderId);
      setSelectedTagIds(emptyCreateNoteDraft.selectedTagIds);
      setStats({ words: 0, chars: 0, lines: 1 });
      setDraftSavedAt(null);
      draftToastShown.current = false;
    }

    loadedDraftKey.current = draftKey;
    setDraftLoaded(true);
  }, [draftKey]);

  useEffect(() => {
    if (!draftLoaded || loadedDraftKey.current !== draftKey) return;
    if (skipNextDraftSave.current) {
      skipNextDraftSave.current = false;
      return;
    }

    const draft: CreateNoteDraft = {
      title,
      contentHtml: sanitizeEditorHtml(contentHtml),
      selectedFolderId,
      selectedTagIds,
      updatedAt: new Date().toISOString(),
    };

    if (isCreateNoteDraftEmpty(draft)) {
      clearCreateNoteDraft(draftKey);
      setDraftSavedAt(null);
      draftToastShown.current = false;
      return;
    }

    writeCreateNoteDraft(draftKey, draft);
    setDraftSavedAt(draft.updatedAt);
    if (!draftToastShown.current) {
      notify({
        title: "Draft saved",
        description: "Your note has been saved in drafts.",
        severity: "success",
      });
      draftToastShown.current = true;
    }
  }, [
    contentHtml,
    draftKey,
    draftLoaded,
    selectedFolderId,
    selectedTagIds,
    title,
  ]);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      notify({
        title: "Title is required",
        description: "Add a title before saving this note.",
        severity: "danger",
      });

      return;
    }
    const sanitizedContent = sanitizeEditorHtml(contentHtml);

    createNote({
      title: title.trim(),
      content: isEditorHtmlEmpty(sanitizedContent) ? undefined : sanitizedContent,
      folder_id: selectedFolderId ?? undefined,
      tag_ids: selectedTagIds.length ? selectedTagIds : undefined,
    }, {
      onSuccess: (note) => {
        clearCreateNoteDraft(draftKey);
        notify({
          title: "Note saved",
          description: "Your note has been saved.",
          severity: "success",
        });
        navigate(`/notes/${note.id}`);
      },
      onError: (err) => {
        const message =
          err instanceof Error ? err.message : "Please try again.";

        notify({
          title: "Note not saved",
          description: message,
          severity: "danger",
        });
      },
    });
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();

    if (!name) return;
    createFolder(name, {
      onSuccess: (folder) => {
        setSelectedFolderId(folder.id);
        setNewFolderName("");
        setShowFolderPicker(false);
        notify({
          title: "Folder created",
          description: `"${folder.name}" is ready to use.`,
          severity: "success",
        });
      },
      onError: (err) => {
        notify({
          title: "Folder not created",
          description:
            err instanceof Error ? err.message : "Please try again.",
          severity: "danger",
        });
      },
    });
  };

  const handleCreateTag = () => {
    const name = newTagName.trim();

    if (!name) return;
    createTag(name, {
      onSuccess: (tag) => {
        setSelectedTagIds((prev) => [...prev, tag.id]);
        setNewTagName("");
        notify({
          title: "Tag created",
          description: `"${tag.name}" was added to this note.`,
          severity: "success",
        });
      },
      onError: (err) => {
        notify({
          title: "Tag not created",
          description:
            err instanceof Error ? err.message : "Please try again.",
          severity: "danger",
        });
      },
    });
  };

  const clearDraft = () => {
    clearCreateNoteDraft(draftKey);
    setTitle(emptyCreateNoteDraft.title);
    setContentHtml(emptyCreateNoteDraft.contentHtml);
    setSelectedFolderId(emptyCreateNoteDraft.selectedFolderId);
    setSelectedTagIds(emptyCreateNoteDraft.selectedTagIds);
    setStats({ words: 0, chars: 0, lines: 1 });
    setDraftSavedAt(null);
    draftToastShown.current = false;
    notify({
      title: "Draft cleared",
      description: "The local draft was removed.",
      severity: "success",
    });
  };

  const handleContentChange = (html: string) => {
    setContentHtml(html);
    if (showWordCount || lineNumbers) setStats(parseEditorStats(html));
  };

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));

  return (
    <main className="min-h-screen bg-[#F7F7FA] pt-20 pb-32 md:pt-32 md:pb-20 dark:bg-[#101113]">
      <header className="flex items-center justify-between p-5">
        <button
          aria-label="Go back"
          className="rounded-full bg-white p-3 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:text-gray-100"
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
        {draftSavedAt && (
          <button
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-900"
            type="button"
            onClick={clearDraft}
          >
            <Trash2 size={12} />
            Clear draft
          </button>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <div ref={folderPickerRef} className="relative">
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              type="button"
              onClick={() => {
                setShowFolderPicker((v) => !v);
                setShowTagPicker(false);
              }}
            >
              <FolderOpen size={14} />
              {selectedFolder ? selectedFolder.name : "Add to folder"}
            </button>

            {showFolderPicker && (
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg min-w-48 py-1 dark:border-gray-800 dark:bg-gray-950">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                  type="button"
                  onClick={() => {
                    setSelectedFolderId(null);
                    setShowFolderPicker(false);
                  }}
                >
                  None
                </button>
                <div className="max-h-40 overflow-y-auto">
                  {folders.map((f) => (
                    <button
                      key={f.id}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 ${
                        selectedFolderId === f.id
                          ? "text-green-600 font-medium"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      type="button"
                      onClick={() => {
                        setSelectedFolderId(f.id);
                        setShowFolderPicker(false);
                      }}
                    >
                      {f.name}
                    </button>
                  ))}
                  {folders.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                      No folders yet
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 mt-1 pt-1 px-2 pb-1 dark:border-gray-800">
                  <div className="flex items-center gap-1">
                    <input
                      className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                      disabled={isCreatingFolder}
                      maxLength={100}
                      placeholder="New folder name"
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateFolder();
                        }
                      }}
                    />
                    <button
                      className="flex items-center justify-center w-6 h-6 rounded-md bg-green-600 text-white hover:bg-green-600/85 disabled:opacity-50 transition shrink-0"
                      disabled={!newFolderName.trim() || isCreatingFolder}
                      type="button"
                      onClick={handleCreateFolder}
                    >
                      {isCreatingFolder ? (
                        <Loader2 className="animate-spin" size={11} />
                      ) : (
                        <Plus size={11} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={tagPickerRef} className="relative">
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              type="button"
              onClick={() => {
                setShowTagPicker((v) => !v);
                setShowFolderPicker(false);
              }}
            >
              <Tag size={14} />
              Add tag
            </button>

            {showTagPicker && (
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg min-w-48 py-1 dark:border-gray-800 dark:bg-gray-950">
                <div className="max-h-40 overflow-y-auto">
                  {tags.map((t) => (
                    <button
                      key={t.id}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 ${
                        selectedTagIds.includes(t.id)
                          ? "text-green-600 font-medium"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                    >
                      {t.name}
                      {selectedTagIds.includes(t.id) && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                  {tags.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                      No tags yet
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 mt-1 pt-1 px-2 pb-1 dark:border-gray-800">
                  <div className="flex items-center gap-1">
                    <input
                      className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                      disabled={isCreatingTag}
                      maxLength={50}
                      placeholder="New tag name"
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateTag();
                        }
                      }}
                    />
                    <button
                      className="flex items-center justify-center w-6 h-6 rounded-md bg-green-600 text-white hover:bg-green-600/85 disabled:opacity-50 transition shrink-0"
                      disabled={!newTagName.trim() || isCreatingTag}
                      type="button"
                      onClick={handleCreateTag}
                    >
                      {isCreatingTag ? (
                        <Loader2 className="animate-spin" size={11} />
                      ) : (
                        <Plus size={11} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {selectedTags.map((t) => (
            <span
              key={t.id}
              className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300"
            >
              {t.name}
              <button
                aria-label={`Remove tag ${t.name}`}
                type="button"
                onClick={() => toggleTag(t.id)}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>

        <textarea
          className="w-full resize-none bg-transparent text-4xl font-bold outline-none leading-tight text-gray-900 placeholder:text-gray-300 dark:text-gray-100 dark:placeholder:text-gray-700"
          placeholder="Untitled Note"
          rows={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <NoteContentEditor
          value={contentHtml}
          onChange={handleContentChange}
          onEditorReady={setEditor}
        />

        {(showWordCount || lineNumbers) && (
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
            {showWordCount && (
              <>
                <span>{stats.words} {stats.words === 1 ? "word" : "words"}</span>
                <span>{stats.chars} {stats.chars === 1 ? "char" : "chars"}</span>
              </>
            )}
            {lineNumbers && (
              <span>{stats.lines} {stats.lines === 1 ? "line" : "lines"}</span>
            )}
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

export default CreateNotesPage;
