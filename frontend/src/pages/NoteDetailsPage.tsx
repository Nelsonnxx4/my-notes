import EditorHeader from "@/components/editor/EditorHeader";
import NoteTitleInput from "@/components/editor/NoteTitleInput";
import NoteContentEditor from "@/components/editor/NoteContentEditor";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ColorPicker from "@/components/editor/ColorPicker";

export default function NoteDetailsPage() {
  return (
    <main className="min-h-screen bg-[#F7F7FA] pb-36">
      <EditorHeader />

      <div className="px-5">
        <ColorPicker />

        <NoteTitleInput />

        <NoteContentEditor />
      </div>

      <EditorToolbar />
    </main>
  );
}
