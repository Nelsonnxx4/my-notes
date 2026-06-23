import { RouterProvider, useHref } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/system";

import { router } from "./router";

import { queryClient } from "@/lib/queryClient";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider useHref={useHref}>
        <RouterProvider router={router} />
      </HeroUIProvider>
    </QueryClientProvider>
  );
};

export default App;
