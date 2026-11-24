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
  return (
    <div
      className="group flex min-h-32 min-w-35 cursor-pointer flex-col justify-between gap-3 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 hover:border-[var(--app-control)] md:min-w-48"
      data-folder-tone={colorScheme.bg}
    >
      <FolderIcon
        className="text-[var(--app-muted)]"
        size={30}
        strokeWidth={1.2}
      />

      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold leading-tight text-[var(--app-text)]">
          {title}
        </span>
        <span className="text-xs text-[var(--app-faint)]">
          {count} {count === 1 ? "note" : "notes"}
        </span>
      </div>
    </div>
  );
};

export default FolderCard;
