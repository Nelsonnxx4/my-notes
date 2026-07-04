import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, FolderOpen, Tag, X, Plus } from "lucide-react";

import { useCreateNote } from "@/hooks/mutations/useCreateNote";
import { useFolders, useCreateFolder } from "@/hooks/useFolder";
import { useTags, useCreateTag } from "@/hooks/useTags";
import EditorToolbar from "@/components/editor/EditorToolbar";

const CreateNotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createNote, isPending } = useCreateNote();
  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();
  const { mutate: createFolder, isPending: isCreatingFolder } = useCreateFolder();
  const { mutate: createTag, isPending: isCreatingTag } = useCreateTag();

  const [title, setTitle] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);
  const folderPickerRef = useRef<HTMLDivElement>(null);
  const tagPickerRef = useRef<HTMLDivElement>(null);

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

  const execFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const insertImage = useCallback(() => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];

      if (!file) return;
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;

        editorRef.current?.focus();
        document.execCommand("insertImage", false, dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, []);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Title is required.");

      return;
    }
    setError(null);
    const content = editorRef.current?.innerHTML ?? "";

    createNote({
      title: title.trim(),
      content: content || undefined,
      folder_id: selectedFolderId ?? undefined,
      tag_ids: selectedTagIds.length ? selectedTagIds : undefined,
    });
  };

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));

  return (
    <main className="min-h-screen bg-[#F7F7FA] py-20">
      {/* Header */}
      <header className="flex items-center justify-between p-5">
        <button
          aria-label="Go back"
          className="rounded-full bg-white p-3 shadow-sm hover:shadow-md transition"
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

        {/* Folder + Tag selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Folder selector */}
          <div ref={folderPickerRef} className="relative">
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 transition"
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
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg min-w-48 py-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
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
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        selectedFolderId === f.id
                          ? "text-green-600 font-medium"
                          : "text-gray-700"
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
                    <p className="px-3 py-2 text-sm text-gray-400">
                      No folders yet
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 mt-1 pt-1 px-2 pb-1">
                  <div className="flex items-center gap-1">
                    <input
                      className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-gray-400"
                      disabled={isCreatingFolder}
                      maxLength={100}
                      placeholder="New folder name"
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const name = newFolderName.trim();

                          if (!name) return;
                          createFolder(name, {
                            onSuccess: (folder) => {
                              setSelectedFolderId(folder.id);
                              setNewFolderName("");
                              setShowFolderPicker(false);
                            },
                          });
                        }
                      }}
                    />
                    <button
                      className="flex items-center justify-center w-6 h-6 rounded-md bg-green-600 text-white hover:bg-green-600/85 disabled:opacity-50 transition shrink-0"
                      disabled={!newFolderName.trim() || isCreatingFolder}
                      type="button"
                      onClick={() => {
                        const name = newFolderName.trim();

                        if (!name) return;
                        createFolder(name, {
                          onSuccess: (folder) => {
                            setSelectedFolderId(folder.id);
                            setNewFolderName("");
                            setShowFolderPicker(false);
                          },
                        });
                      }}
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

          {/* Tag selector */}
          <div ref={tagPickerRef} className="relative">
            <button
              className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 transition"
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
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg min-w-48 py-1">
                <div className="max-h-40 overflow-y-auto">
                  {tags.map((t) => (
                    <button
                      key={t.id}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
                        selectedTagIds.includes(t.id)
                          ? "text-green-600 font-medium"
                          : "text-gray-700"
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
                    <p className="px-3 py-2 text-sm text-gray-400">
                      No tags yet
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 mt-1 pt-1 px-2 pb-1">
                  <div className="flex items-center gap-1">
                    <input
                      className="flex-1 rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-gray-400"
                      disabled={isCreatingTag}
                      maxLength={50}
                      placeholder="New tag name"
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const name = newTagName.trim();

                          if (!name) return;
                          createTag(name, {
                            onSuccess: (tag) => {
                              setSelectedTagIds((prev) => [...prev, tag.id]);
                              setNewTagName("");
                            },
                          });
                        }
                      }}
                    />
                    <button
                      className="flex items-center justify-center w-6 h-6 rounded-md bg-green-600 text-white hover:bg-green-600/85 disabled:opacity-50 transition shrink-0"
                      disabled={!newTagName.trim() || isCreatingTag}
                      type="button"
                      onClick={() => {
                        const name = newTagName.trim();

                        if (!name) return;
                        createTag(name, {
                          onSuccess: (tag) => {
                            setSelectedTagIds((prev) => [...prev, tag.id]);
                            setNewTagName("");
                          },
                        });
                      }}
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

          {/* Selected tag chips */}
          {selectedTags.map((t) => (
            <span
              key={t.id}
              className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1"
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

        {/* Title */}
        <textarea
          className="w-full resize-none bg-transparent text-4xl font-bold outline-none leading-tight placeholder:text-gray-300"
          placeholder="Untitled Note"
          rows={2}
          value={title}
          onChange={(e) => {
            setError(null);
            setTitle(e.target.value);
          }}
        />

        {/* Rich text editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          aria-multiline="true"
          className="w-full min-h-[60vh] bg-transparent text-base leading-8 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2"
          data-placeholder="Start writing..."
          role="textbox"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              const sel = window.getSelection();
              const anchorNode = sel?.anchorNode;
              const anchorElement =
                anchorNode instanceof Element
                  ? anchorNode
                  : anchorNode?.parentElement;

              if (anchorElement?.tagName === "LI") {
                return;
              }
            }
          }}
        />

        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
        `}</style>
      </div>

      <EditorToolbar execFormat={execFormat} onInsertImage={insertImage} />
    </main>
  );
};

export default CreateNotesPage;
