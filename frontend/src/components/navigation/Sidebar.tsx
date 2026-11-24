import {
  ArchiveIcon,
  BookmarkIcon,
  FolderIcon,
  HomeIcon,
  PenIcon,
  PlusIcon,
  SettingsIcon,
  TagIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import BrandMark from "@/components/BrandMark";

const primaryNavigation = [
  { icon: HomeIcon, label: "Home", path: "/home" },
  { icon: PlusIcon, label: "New note", path: "/create" },
  { icon: PenIcon, label: "All notes", path: "/notes" },
  { icon: BookmarkIcon, label: "Favourites", path: "/favorites" },
  { icon: ArchiveIcon, label: "Archive", path: "/archive" },
  { icon: FolderIcon, label: "Folders", path: "/folders" },
  { icon: TagIcon, label: "Tags", path: "/tags" },
];

function navigationClass(isActive: boolean) {
  return `flex h-9 items-center gap-2 rounded-[var(--app-radius-control)] px-3 text-sm transition-colors ${
    isActive
      ? "bg-[var(--app-active)] text-[var(--app-text)]"
      : "text-[var(--app-muted)] hover:bg-[var(--app-raised)] hover:text-[var(--app-text)]"
  }`;
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const emailPrefix = user?.email?.split("@")[0] ?? "User";
  const displayName = localStorage.getItem("app:displayName") ?? emailPrefix;

  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-60 shrink-0 flex-col border-r border-[var(--app-border)] bg-[var(--app-ground)] p-3 md:flex">
      <div className="flex h-11 items-center gap-2 px-2">
        <BrandMark />
        <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--app-text)]">
          Not-lify
        </span>
      </div>

      <nav aria-label="Main navigation" className="mt-7 space-y-1">
        {primaryNavigation.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            className={({ isActive }) => navigationClass(isActive)}
            to={path}
          >
            <Icon size={16} strokeWidth={1.6} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-[var(--app-rule)] pt-3">
        <NavLink
          className={({ isActive }) => navigationClass(isActive)}
          to="/settings"
        >
          <SettingsIcon size={16} strokeWidth={1.6} />
          <span>Settings</span>
        </NavLink>
        <div className="mt-4 flex items-center gap-2 px-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--app-active)] text-xs font-semibold text-[var(--app-text)]">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 truncate text-xs text-[var(--app-muted)]">
            {user?.email ?? ""}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
