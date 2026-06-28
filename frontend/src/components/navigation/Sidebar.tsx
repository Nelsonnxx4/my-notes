import {
  ArchiveIcon,
  BookmarkIcon,
  CloudIcon,
  PenIcon,
  SettingsIcon,
  TagIcon,
  FolderIcon,
  HomeIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const SidebarOptions = [
    { id: 1, icon: HomeIcon, name: "Home", path: "/home" },
    { id: 2, icon: PenIcon, name: "All notes", path: "/notes" },
    { id: 3, icon: BookmarkIcon, name: "Favorites", path: "/favorites" },
    { id: 4, icon: ArchiveIcon, name: "Archive", path: "/archive" },
    { id: 5, icon: FolderIcon, name: "Folders", path: "/folders" },
    { id: 6, icon: TagIcon, name: "Tags", path: "/tags" },
  ];

  const SidebarSettings = [
    { id: 1, icon: SettingsIcon, name: "Settings", path: "/settings" },
    { id: 2, icon: CloudIcon, name: "Sync", path: "/sync" },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-2 mb-2 w-[80%] mx-3 px-4 py-2 cursor-pointer transition-all rounded-md group border-none",
      isActive
        ? "bg-green-600 hover:bg-green-600/85 outline-2 outline-offset-1 outline-accent-100 border border-green-400"
        : "hover:bg-gray-100/85 hover:border hover:border-gray-300",
    ].join(" ");

  return (
    <aside className="sticky top-0 xl:w-65 md:w-50 h-screen border-r border-gray-300 bg-white hidden md:flex flex-col shrink-0 z-40">
      <section className="flex justify-start items-center gap-2 border-b border-gray-300 py-8 px-4 shrink-0">
        <img
          alt="profile pic"
          className="h-12 w-12 rounded-full object-cover"
          src="/images/prfpic.jpg"
        />
        <div className="flex flex-col leading-5 -space-y-1">
          <h3 className="font-semibold text-md text-gray-800">Nelson</h3>
          <span className="text-gray-500 text-sm underline underline-offset-2">
            nelson@gmail.co
          </span>
        </div>
      </section>

      {/* Main nav */}
      <section className="flex flex-col justify-start items-start py-5 shrink-0 mt-8">
        <h3 className="px-4 text-gray-500 text-lg mb-2">Main</h3>
        {SidebarOptions.map((option) => {
          const Icon = option.icon;

          return (
            <NavLink
              key={option.id}
              className={navLinkClass}
              end={option.path === "/"}
              to={option.path}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-800"}`}
                    strokeWidth={1.5}
                  />
                  <span
                    className={
                      isActive
                        ? "text-white font-medium"
                        : "text-gray-600 group-hover:text-gray-800"
                    }
                  >
                    {option.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </section>

      {/* Settings — pinned to bottom */}
      <section className="flex flex-col justify-start items-start py-5 pb-10 mt-auto shrink-0">
        <h3 className="px-4 text-gray-500 text-lg mb-2">Settings</h3>
        {SidebarSettings.map((setting) => {
          const Icon = setting.icon;

          return (
            <NavLink
              key={setting.id}
              className={navLinkClass}
              to={setting.path}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-800"}`}
                    strokeWidth={1.5}
                  />
                  <span
                    className={
                      isActive
                        ? "text-white font-medium"
                        : "text-gray-600 group-hover:text-gray-800"
                    }
                  >
                    {setting.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </section>
    </aside>
  );
};

export default Sidebar;
