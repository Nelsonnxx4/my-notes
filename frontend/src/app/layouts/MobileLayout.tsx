import { Outlet } from "react-router-dom";

import BottomNavbar from "@/components/navigation/ButtonNavbar";

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-[#F7F7FA] pb-24">
      <Outlet />
      <BottomNavbar />
    </div>
  );
}
