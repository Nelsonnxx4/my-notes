import { Home, PenSquare, Plus, Star, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/notes", icon: PenSquare, label: "Notes" },
  { path: "/create", icon: Plus, label: "Create", accent: true },
  { path: "/favorites", icon: Star,       label: "Favourites" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const BottomNavbar = () => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--app-border)] bg-[var(--app-surface)] px-2 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex h-16 items-stretch justify-between">
        {links.map(({ path, icon: Icon, label, accent }) => (
          <NavLink
            key={path}
            aria-label={label}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] ${
                isActive ? "font-medium text-[var(--app-text)]" : "text-[var(--app-muted)]"
              }`
            }
            end
            to={path}
          >
            <span
              className={
                accent
                  ? "grid h-7 w-9 place-items-center rounded-[var(--app-radius-control)] bg-[var(--app-primary)] text-white"
                  : "grid h-7 w-9 place-items-center"
              }
            >
              <Icon size={accent ? 18 : 17} strokeWidth={1.7} />
            </span>
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
