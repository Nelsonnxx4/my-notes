import { FolderIcon } from "lucide-react";

export interface FolderColorScheme {
  bg: string;
  text: string;
  border: string;
  icon: string;
}

interface FolderCardProps {
  title: string;
  count: number;
  colorScheme: FolderColorScheme;
}

const FolderCard: React.FC<FolderCardProps> = ({
  title,
  count,
  colorScheme,
}) => {
  const { bg, text, border, icon } = colorScheme;

  return (
    <div
      className={`
        group flex flex-col justify-between gap-3
        md:min-w-50 md:min-h-50 p-4 rounded-md
        border cursor-pointer
        transition-all duration-150 hover:shadow-sm hover:brightness-95
        ${bg} ${border}
      `}
    >
      {/* Folder icon — colored */}
      <FolderIcon
        className={`${icon} transition-transform duration-150 group-hover:scale-105`}
        size={40}
        strokeWidth={1.2}
      />

      {/* Title + note count */}
      <div className="flex flex-col gap-0.5">
        <span className={`font-semibold text-sm leading-tight ${text}`}>
          {title}
        </span>
        <span className="text-xs text-gray-400">
          {count} {count === 1 ? "note" : "notes"}
        </span>
      </div>
    </div>
  );
};

export default FolderCard;
