const Sidebar: React.FC = () => {
  const SidebarOptions = [
    { id: 1, icon: "", name: "All notes" },
    { id: 2, icon: "", name: "Favourites" },
    { id: 3, icon: "", name: "Tags" },
    { id: 1, icon: "", name: "All notes" },
    { id: 1, icon: "", name: "All notes" },
  ];

  return (
    <aside className="md:w-[25%] border-r border-grat-200 bg-white">
      <section className="flex justify-center items-center gap-2 border-b border-gray-200">
        <img src="@/assets/images/prfpic.jpg" alt="profile pic" />
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-sm text-gray-800">Nelson</h3>
          <span className="text-gray-300">nelson@gmail.co</span>
        </div>
      </section>

      {/* main section */}
      <section></section>
    </aside>
  );
};

export default Sidebar;
