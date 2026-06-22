import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import useMediaQuery from "@/hooks/useMediaQuery";

const ResponsiveLayout = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
};

export default ResponsiveLayout;
