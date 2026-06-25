import { MoreHorizontalIcon, PlusIcon } from "lucide-react";

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
        <h3 className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold  text-slate-700">
          Psychology
        </h3>

        <div className="flex justify-between items-center text-gray-700">
          <PlusIcon className="cursor-pointer" strokeWidth={1.5} />
          <MoreHorizontalIcon className="cursor-pointer" strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative flex flex-col bg-white rounded-2xl p-4 h-[88%]">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="line-clamp-5 text-sm leading-6 text-slate-700">
          {content}
        </p>

        <div className="mt-5 absolute bottom-2 flex items-baseline justify-between text-xs text-slate-600">
          <span>2h ago</span>
          <span className="rounded-full bg-white/80 px-3 py-1">Updated</span>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
