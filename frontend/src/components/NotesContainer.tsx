import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  selectNote,
  setSearchQuery,
  setActiveTag,
  toggleSidebar,
} from "@/stores/slices/uiSlice";
import {
  useNotes,
  useCreateNote,
  useDeleteNote,
  usePinNote,
} from "@/hooks/useNotes";
import { useTags } from "@/hooks/useTags";
import DefaultLayout from "@/layouts/default";

export default function NotesPage() {
  const dispatch = useAppDispatch();

  // Redux UI state
  const { selectedNoteId, searchQuery, activeTagId, sidebarOpen, viewMode } =
    useAppSelector((s) => s.ui);

  // TanStack Query — server state
  const { data: notes, isLoading, isError } = useNotes();
  const { data: tags } = useTags();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const pinNote = usePinNote();

  const handleCreateNote = () => {
    createNote.mutate(
      { title: "Untitled", content: "" },
      { onSuccess: (note) => dispatch(selectNote(note.id)) }
    );
  };

  const handleDeleteNote = (id: string) => {
    deleteNote.mutate(id, {
      onSuccess: () => dispatch(selectNote(null)),
    });
  };

  const handlePinNote = (id: string, currentPinned: boolean) => {
    pinNote.mutate({ id, is_pinned: !currentPinned });
  };

  if (isError) return <div>Something went wrong. Please try again.</div>;

  return (
    <DefaultLayout>
      <div className="flex h-full gap-4">
        {/* Sidebar - Tags (Redux controls open state) */}
        {sidebarOpen && (
          <aside className="w-48 flex flex-col gap-2">
            <p className="font-semibold text-sm">Tags</p>
            <button onClick={() => dispatch(setActiveTag(null))}>
              All Notes
            </button>
            {tags?.map((tag) => (
              <button
                key={tag.id}
                className={activeTagId === tag.id ? "text-primary" : ""}
                onClick={() => dispatch(setActiveTag(tag.id))}
              >
                {tag.name}
              </button>
            ))}
          </aside>
        )}

        {/* Notes List - TanStack Query provides data */}
        <main className="flex-1">
          <div className="flex gap-2 mb-4">
            <input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
            <button disabled={createNote.isPending} onClick={handleCreateNote}>
              {createNote.isPending ? "Creating..." : "+ New Note"}
            </button>
            <button onClick={() => dispatch(toggleSidebar())}>
              Toggle Sidebar
            </button>
          </div>

          {isLoading ? (
            <div>Loading notes...</div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-3 gap-4"
                  : "flex flex-col gap-2"
              }
            >
              {notes?.map((note) => (
                <button
                  key={note.id}
                  aria-pressed={selectedNoteId === note.id}
                  className={`p-4 border rounded text-left cursor-pointer w-full ${
                    selectedNoteId === note.id ? "border-primary" : ""
                  }`}
                  tabIndex={0}
                  type="button"
                  onClick={() => dispatch(selectNote(note.id))}
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{note.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinNote(note.id, note.is_pinned);
                        }}
                      >
                        {note.is_pinned ? "📌" : "📍"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {note.content}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {note.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs bg-default-100 px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </DefaultLayout>
  );
}
