import { motion } from "framer-motion";

import NoteCard from "@/components/notes/NoteCard";
import { notes } from "@/constant/notesConstants";

const COLORS = [
  "bg-[#fc843e96]",
  "bg-[#D7B0CB96]",
  "bg-[#34d39996]",
  "bg-[#D1F5E096]",
  "bg-[#FFE4D696]",
  "bg-[#f6ec3396]",
  "bg-[#926bf496]",
  "bg-[#E03F4096]",
];

function hashColor(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return COLORS[Math.abs(hash) % COLORS.length];
}

// Show the 6 most recent notes on the home page
const recentNotes = notes.slice(0, 6).map((note) => ({
  ...note,
  color: hashColor(note.title),
}));

const now = new Date();
const hour = now.getHours();
const greeting =
  hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-20">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-1">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-3xl font-bold text-gray-800">
          {greeting}, Nelson 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          You have{" "}
          <span className="text-green-500 font-semibold">
            {notes.length} notes
          </span>{" "}
          in your collection.
        </p>
      </motion.div>

      {/* Recent notes label */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700 font-semibold text-lg">Recent Notes</h2>
        <a
          className="text-green-500 text-sm font-medium hover:underline"
          href="/notes"
        >
          View all →
        </a>
      </div>

      {/* Notes grid — same layout as NotesPage */}
      <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
        {recentNotes.map((note, i) => (
          <motion.div
            key={note.title}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <NoteCard {...note} color={note.color} />
          </motion.div>
        ))}
      </section>
    </main>
  );
};

export default HomePage;
