interface NoteCardProps {
  title: string;
  content: string;
  color: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, content, color }) => {
  return (
    <article
      className={`min-w-60 h-90 overflow-hidden rounded-2xl border border-gray-300 p-4  transition-all hover:-translate-y-0.5 hover:shadow-lg ${color}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
          Note
        </span>
        <div className="h-10 w-10 rounded-3xl bg-white/80 shadow-sm" />
      </div>

      <h3 className="mb-3 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="line-clamp-5 text-sm leading-6 text-slate-700">{content}</p>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-600">
        <span>2h ago</span>
        <span className="rounded-full bg-white/80 px-3 py-1">Updated</span>
      </div>
    </article>
  );
};

export default NoteCard;
