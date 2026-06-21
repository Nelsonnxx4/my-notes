import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";

import NoteCard from "@/components/notes/NoteCard";
import FloatingButton from "@/components/ui/FloatingButton";

const notes = [
  {
    title: "Meeting Notes",
    content: "Sprint planning and product roadmap discussion.",
    color: "#FCEAA8",
  },
  {
    title: "Startup Ideas",
    content: "Build an AI-powered note organization tool.",
    color: "#F7CBE9",
  },
  {
    title: "Travel Checklist",
    content: "Passport, tickets, accommodation, itinerary.",
    color: "#CFEFFF",
  },
];

export default function NotesPage() {
  return (
    <main className="px-5 pt-8 pb-24">
      <h1 className="mb-6 text-3xl font-bold">My Notes</h1>

      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 1,
          768: 2,
        }}
      >
        <Masonry gutter="16px">
          {notes.map((note) => (
            <motion.div
              key={note.title}
              animate={{
                opacity: 1,
                y: 0,
              }}
              initial={{
                opacity: 0,
                y: 20,
              }}
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
