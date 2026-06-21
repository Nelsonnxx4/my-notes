import { Notebook, Plus, Search, Folder, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    path: "/",
    icon: Notebook,
  },
  {
    path: "/create",
    icon: Plus,
  },
  {
    path: "/search",
    icon: Search,
  },
  {
    path: "/folders",
    icon: Folder,
  },
  // {
  //   path: "/profile",
  //   icon: User,
  // },
];

export default function BottomNavbar() {
  return (
    <div className="fixed bottom-2 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 rounded-full bg-white/95 px-2 py-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {links.map(({ path, icon: Icon }) => (
          <NavLink
            key={path}
            className={({ isActive }) =>
              isActive
                ? "flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-sm"
                : "flex h-10 w-10 items-center justify-center rounded-3xl text-black font-semibold hover:bg-slate-100"
            }
            to={path}
          >
            <Icon size={18} strokeWidth={1.5} />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
