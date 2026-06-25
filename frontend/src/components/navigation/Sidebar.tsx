import {
  ArchiveIcon,
  BookmarkIcon,
  CloudSyncIcon,
  PenIcon,
  SettingsIcon,
  TagIcon,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const SidebarOptions = [
    { id: 1, icon: PenIcon, name: "All notes" },
    { id: 2, icon: BookmarkIcon, name: "Favourites" },
    { id: 3, icon: ArchiveIcon, name: "Archive" },
    { id: 4, icon: TagIcon, name: "Tags" },
  ];

  const SidebarSettings = [
    { id: 1, icon: SettingsIcon, name: "Settings" },
    { id: 2, icon: CloudSyncIcon, name: "Sync" },
  ];

  return (
    <aside className="sticky top-0 w-65 h-screen border-r border-gray-300 bg-white hidden md:flex flex-col shrink-0 z-40">
      <section className="flex justify-start items-center gap-2 border-b border-gray-300 py-8 px-4 shrink-0">
        <img
          alt="profile pic"
          className="h-12 w-12 rounded-full"
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
        {SidebarOptions.map((sidebaroption) => {
          const Icon = sidebaroption.icon;

          return (
            <div
              key={sidebaroption.id}
              className="flex items-center gap-2 mb-1 w-[80%] mx-3 px-4 py-2 hover:bg-gray-100 hover:border hover:border-gray-300 cursor-pointer transition-all rounded-md group"
            >
              <Icon
                className="h-4 w-4 text-gray-500 group-hover:text-gray-800"
                strokeWidth={1.5}
              />
              <span className="text-gray-600 group-hover:text-gray-800">
                {sidebaroption.name}
              </span>
            </div>
          );
        })}
      </section>

      {/* Settings — pinned to bottom */}
      <section className="flex flex-col justify-start items-start py-5 pb-10 mt-auto shrink-0">
        <h3 className="px-4 text-gray-500 text-lg mb-2">Settings</h3>
        {SidebarSettings.map((sidebarSetting) => {
          const Icon = sidebarSetting.icon;

          return (
            <div
              key={sidebarSetting.id}
              className="flex items-center gap-2 mb-1 w-[80%] mx-3 px-4 py-2 hover:bg-gray-100 hover:border hover:border-gray-300 cursor-pointer transition-all rounded-md group"
            >
              <Icon
                className="h-4 w-4 text-gray-500 group-hover:text-gray-800"
                strokeWidth={1.5}
              />
              <span className="text-gray-600 group-hover:text-gray-800">
                {sidebarSetting.name}
              </span>
            </div>
          );
        })}
      </section>
    </aside>
  );
};

export default Sidebar;
