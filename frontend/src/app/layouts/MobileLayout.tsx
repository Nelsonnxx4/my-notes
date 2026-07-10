import { Outlet } from "react-router-dom";

import BottomNavbar from "@/components/navigation/BottomNavbar";
import Header from "@/components/Header";

const MobileLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
      <BottomNavbar />
    </div>
  );
};

export default MobileLayout;
