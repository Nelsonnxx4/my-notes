interface Props {
  title: string;
  content: string;
  colorClass: string;
}

const NoteCard = ({ title, content, colorClass }: Props) => {
  return (
    <article
      className={`overflow-hidden rounded-[32px] p-5 shadow-[0_20px_40px_rgba(37,45,75,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(37,45,75,0.12)] ${colorClass}`}
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
