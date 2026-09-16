import { Outlet } from "react-router-dom";

import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/Header";

const DesktopLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 min-h-screen md:ml-50 xl:ml-65">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
