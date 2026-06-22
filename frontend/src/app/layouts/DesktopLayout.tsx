import { Outlet } from "react-router-dom";

import Sidebar from "@/components/navigation/Sidebar";

const DesktopLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-[260px] flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DesktopLayout;
