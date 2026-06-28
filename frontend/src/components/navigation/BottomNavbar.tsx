import { Notebook, Plus, Search, Folder, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { path: "/", icon: Notebook, label: "Home" },
  { path: "/create", icon: Plus, label: "Create" },
  { path: "/search", icon: Search, label: "Search" },
  { path: "/folders", icon: Folder, label: "Folders" },
  { path: "/tags", icon: Tag, label: "Tags" },
];

const BottomNavbar = () => {
  return (
    <div className="fixed block md:hidden bottom-2 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 rounded-full bg-gray-100 px-2 py-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {links.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            aria-label={label}
            className={({ isActive }) =>
              isActive
                ? "flex h-10 w-10 items-center justify-center rounded-3xl bg-green-400 text-white shadow-sm"
                : "flex h-10 w-10 items-center justify-center rounded-3xl text-black font-semibold hover:bg-slate-100"
            }
            end={path === "/"}
            to={path}
          >
            <Icon size={18} strokeWidth={1.5} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
