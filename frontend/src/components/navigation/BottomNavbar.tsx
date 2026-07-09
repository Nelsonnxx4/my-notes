import { Home, PenSquare, Plus, Star, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { path: "/home",      icon: Home,       label: "Home" },
  { path: "/notes",     icon: PenSquare,  label: "Notes" },
  { path: "/create",    icon: Plus,       label: "Create", accent: true },
  { path: "/favorites", icon: Star,       label: "Favourites" },
  { path: "/settings",  icon: Settings,   label: "Settings" },
];

const BottomNavbar = () => {
  return (
    <div className="fixed bottom-2 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 rounded-full bg-white border border-gray-200 px-2 py-2 shadow-[0_8px_32px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between">
        {links.map(({ path, icon: Icon, label, accent }) => (
          <NavLink
            key={path}
            aria-label={label}
            className={({ isActive }) =>
              accent
                ? "flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white shadow-sm"
                : isActive
                  ? "flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600"
                  : "flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
            }
            end
            to={path}
          >
            <Icon size={accent ? 20 : 18} strokeWidth={1.8} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
