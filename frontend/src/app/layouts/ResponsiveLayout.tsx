import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useAutoSync } from "@/hooks/useAutoSync";
import CommandPalette from "@/components/CommandPalette";

const ResponsiveLayout = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  useAutoSync();

  return (
    <>
      {isDesktop ? <DesktopLayout /> : <MobileLayout />}
      <CommandPalette />
    </>
  );
};

export default ResponsiveLayout;
