import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";

import NoteCard from "@/components/notes/NoteCard";
import { notes } from "@/constant/notesConstants";

const notesWithColors = notes.map((note) => ({
  ...note,
  color: (() => {
    const colors = [
      "bg-[#fc843e96]",
      "bg-[#D7B0CB96]",
      "bg-[#34d39996]",
      "bg-[#D1F5E096]",
      "bg-[#FFE4D696]",
      "bg-[#f6ec3396]",
      "bg-[#926bf496]",
      "bg-[#E03F4096]",
    ];
    let hash = 0;

    for (let i = 0; i < note.title.length; i++) {
      const char = note.title.charCodeAt(i);

      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return colors[Math.abs(hash) % colors.length];
  })(),
}));

const NotesPage = () => {
  return (
    <main className="min-h-screen grid lg:grid-cols-3 md:grid-cols-2  grid-rows-2 gap-3 md:px-4 lg:px-2 xl:px-10 py-20">
      {/* <ResponsiveMasonry> */}
      {/* <Masonry gutter="2px"> */}
      {notesWithColors.map((note) => (
        <motion.div
          key={note.title}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35 }}
        >
          <NoteCard {...note} color={note.color} />
        </motion.div>
      ))}
      {/* </Masonry> */}
      {/* </ResponsiveMasonry> */}
    </main>
  );
};

export default NotesPage;
