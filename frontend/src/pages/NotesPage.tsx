import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";

import SearchInput from "@/components/ui/SearchInput";
import NoteCard from "@/components/notes/NoteCard";
import FloatingButton from "@/components/ui/FloatingButton";
import CategoryChip from "@/components/ui/CategoryChip";

const categories = ["All", "Work", "To-Do", "Reading", "Ideas"];

const notes = [
  {
    title: "Design Review",
    content: "Review the latest user flows and update the onboarding screens.",
    colorClass: "bg-noteYellow",
  },
  {
    title: "Weekly Plan",
    content: "Prepare the roadmap and team tasks for the week ahead.",
    colorClass: "bg-notePink",
  },
  {
    title: "Packing List",
    content: "Passport, tickets, laptop charger, and meeting notes.",
    colorClass: "bg-noteBlue",
  },
  {
    title: "Book Notes",
    content: "Summarize key ideas from the latest productivity read.",
    colorClass: "bg-noteGreen",
  },
];

export default function NotesPage() {
  return (
    <main className="min-h-screen bg-[#F4F6FB] px-5 pt-8 pb-28">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Notes</h1>
            <p className="text-sm text-slate-500">
              Everything organized in one beautiful workspace.
            </p>
          </div>
          <button className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            All
          </button>
        </div>

        <SearchInput />

        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((title) => (
            <CategoryChip key={title} title={title} active={title === "All"} />
          ))}
        </div>
      </div>

      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 768: 2 }}>
        <Masonry gutter="18px">
          {notes.map((note) => (
            <motion.div
              key={note.title}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
            >
              <NoteCard {...note} />
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      <FloatingButton />
    </main>
  );
}
