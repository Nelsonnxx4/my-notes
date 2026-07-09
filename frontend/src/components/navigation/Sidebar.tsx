import { useState, useEffect, useRef } from "react";
import {
  ArchiveIcon,
  BookmarkIcon,
  PenIcon,
  SettingsIcon,
  TagIcon,
  FolderIcon,
  HomeIcon,
  PlusIcon,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  useQueryClient,
  useIsFetching,
  useIsMutating,
} from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";

const SyncButton: React.FC = () => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isSyncing = isFetching > 0 || isMutating > 0;

  const [justSynced, setJustSynced] = useState(false);
  const wasSyncing = useRef(false);

  useEffect(() => {
    if (isSyncing) {
      wasSyncing.current = true;
      setJustSynced(false);

      return;
    }

    if (wasSyncing.current) {
      wasSyncing.current = false;
      setJustSynced(true);
      const timer = setTimeout(() => setJustSynced(false), 2000);

      return () => clearTimeout(timer);
    }
  }, [isSyncing]);

  const handleSync = () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    queryClient.invalidateQueries({ queryKey: ["folders"] });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  };

  return (
    <button
      className="flex items-center gap-2 mb-2 w-[80%] mx-3 px-4 py-2 cursor-pointer transition-all rounded-md group border-none hover:bg-gray-100/85 hover:border hover:border-gray-300"
      title={isSyncing ? "Syncing…" : "Click to sync"}
      type="button"
      onClick={handleSync}
    >
      {justSynced && !isSyncing ? (
        <CheckCircle
          className="h-4 w-4 text-green-500 transition-all"
          strokeWidth={1.5}
        />
      ) : (
        <RefreshCw
          className={`h-4 w-4 text-gray-500 group-hover:text-gray-800 transition-all ${
            isSyncing ? "animate-spin" : ""
          }`}
          strokeWidth={1.5}
        />
      )}
      <span className="text-gray-600 group-hover:text-gray-800 text-sm">
        {isSyncing ? "Syncing…" : justSynced ? "Synced" : "Sync"}
      </span>
    </button>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const emailPrefix = user?.email?.split("@")[0] ?? "User";
  const displayName = localStorage.getItem("app:displayName") ?? emailPrefix;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const SidebarOptions = [
    { id: 1, icon: HomeIcon, name: "Home", path: "/home" },
    { id: 2, icon: PlusIcon, name: "New Note", path: "/create" },
    { id: 3, icon: PenIcon, name: "All notes", path: "/notes" },
    { id: 4, icon: BookmarkIcon, name: "Favorites", path: "/favorites" },
    { id: 5, icon: ArchiveIcon, name: "Archive", path: "/archive" },
    { id: 6, icon: FolderIcon, name: "Folders", path: "/folders" },
    { id: 7, icon: TagIcon, name: "Tags", path: "/tags" },
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
        <div className="relative shrink-0">
          <div className="h-11 w-11 rounded-full bg-green-100 ring-2 ring-green-200 flex items-center justify-center text-green-700 text-base font-bold select-none">
            {avatarLetter}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
        </div>
        <div className="flex flex-col leading-5 min-w-0">
          <h3 className="font-semibold text-sm text-gray-800 truncate">
            {displayName}
          </h3>
          <span className="text-gray-500 text-xs truncate">
            {user?.email ?? ""}
          </span>
        </div>
      </section>

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

      <section className="flex flex-col justify-start items-start py-5 pb-10 mt-auto shrink-0">
        <h3 className="px-4 text-gray-500 text-lg mb-2">Settings</h3>

        <NavLink className={navLinkClass} to="/settings">
          {({ isActive }) => (
            <>
              <SettingsIcon
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
                Settings
              </span>
            </>
          )}
        </NavLink>

        <SyncButton />
      </section>
    </aside>
  );
};

export default Sidebar;
