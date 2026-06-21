import { House, Notebook, Search, Folder, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    path: "/",
    icon: House,
  },
  {
    path: "/notes",
    icon: Notebook,
  },
  {
    path: "/search",
    icon: Search,
  },
  {
    path: "/folders",
    icon: Folder,
  },
  {
    path: "/profile",
    icon: User,
  },
];

export default function BottomNavbar() {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 rounded-full bg-white/95 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {links.map(({ path, icon: Icon }) => (
          <NavLink
            key={path}
            className={({ isActive }) =>
              isActive
                ? "flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-sm"
                : "flex h-12 w-12 items-center justify-center rounded-3xl text-slate-500 hover:bg-slate-100"
            }
            to={path}
          >
            <Icon size={20} />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
