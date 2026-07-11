import { Outlet } from "react-router-dom";

import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/Header";

const DesktopLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
