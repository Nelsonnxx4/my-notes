import SearchInput from "@/components/ui/SearchInput";
import CategoryChip from "@/components/ui/CategoryChip";
import NoteCard from "@/components/notes/NoteCard";

const categories = [
  { title: "All", active: true },
  { title: "Work" },
  { title: "Ideas" },
  { title: "Travel" },
  { title: "Personal" },
];

const notes = [
  {
    title: "Meeting Notes",
    content:
      "Sprint planning and product roadmap discussion for the next release.",
    colorClass: "bg-noteYellow",
  },
  {
    title: "Startup Ideas",
    content: "Build an AI-powered note organization tool with smart tags.",
    colorClass: "bg-notePink",
  },
  {
    title: "Travel Checklist",
    content: "Passport, tickets, accommodation, itinerary, and packing list.",
    colorClass: "bg-noteBlue",
  },
];

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#F4F6FB] px-5 pb-28 pt-10">
      <section className="rounded-[40px] bg-white p-6 shadow-[0_20px_50px_rgba(60,64,82,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              All-in-Notes
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-slate-900">
              Start turning thoughts into action with a simple note-taking
              experience.
            </h1>
            <p className="mt-4 text-sm text-slate-500">
              Capture ideas, tasks, and plans in one mobile-friendly workspace.
            </p>
          </div>

          <button className="flex h-14 w-14 items-center justify-center rounded-[26px] bg-slate-900 text-white shadow-lg shadow-slate-900/10">
            &rarr;
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[32px] bg-[#FDF1D1] p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Work</p>
            <p className="mt-3 text-sm text-slate-600">
              Design review and team sync meetings.
            </p>
          </div>

          <div className="rounded-[32px] bg-[#E7E8FF] p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Personal</p>
            <p className="mt-3 text-sm text-slate-600">
              Plan your next trip and daily routines.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">My Notes</h2>
            <p className="text-sm text-slate-500">
              Review your latest notes and stay organized.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[32px] bg-white p-5 shadow-[0_20px_50px_rgba(60,64,82,0.08)]">
          <SearchInput />

          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <CategoryChip
                key={category.title}
                active={category.active}
                title={category.title}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-4">
            {notes.map((note) => (
              <NoteCard key={note.title} {...note} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
