import { Outlet } from "react-router-dom";

import BottomNavbar from "@/components/navigation/BottomNavbar";

const MobileLayout = () => {
  return (
    <div className="min-h-screen ">
      <Outlet />
      <BottomNavbar />
    </div>
  );
};

export default MobileLayout;
