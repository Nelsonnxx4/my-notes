import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useAutoSync } from "@/hooks/useAutoSync";

const ResponsiveLayout = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  useAutoSync();

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
};

export default ResponsiveLayout;
