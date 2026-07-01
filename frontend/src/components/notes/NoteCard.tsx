import { Pin, MoreHorizontalIcon } from "lucide-react";

import { Tag } from "@/types";

interface NoteCardProps {
  title: string;
  content: string;
  color: string;
  tags?: Tag[];
  isPinned?: boolean;
  updatedAt?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);

  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);

  if (h < 24) return `${h}h ago`;

  return `${Math.floor(h / 24)}d ago`;
}

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  content,
  color,
  tags,
  isPinned,
  updatedAt,
}) => {
  return (
    <article
      className={`min-w-60 h-90 overflow-hidden rounded-2xl border border-gray-300 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${color}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
          {tags && tags.length > 0 ? `#${tags[0].name}` : "Note"}
        </h3>
        <div className="flex items-center gap-1 text-gray-700">
          {isPinned && (
            <Pin size={14} strokeWidth={1.5} className="text-slate-600" />
          )}
          <MoreHorizontalIcon className="cursor-pointer" strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative flex flex-col bg-white rounded-2xl p-4 h-[88%]">
        <h3 className="mb-3 text-lg font-semibold text-slate-900 line-clamp-2">
          {title}
        </h3>
        <p className="line-clamp-5 text-sm leading-6 text-slate-700">
          {content}
        </p>
        <div className="mt-5 absolute bottom-2 flex items-baseline justify-between w-[calc(100%-2rem)] text-xs text-slate-600">
          <span>{updatedAt ? timeAgo(updatedAt) : ""}</span>
          <span className="rounded-full bg-white/80 px-3 py-1">Updated</span>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
