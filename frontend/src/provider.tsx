import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppearanceProvider } from "@/contexts/AppearanceContext";
import { NoteFiltersProvider } from "@/contexts/NoteFiltersContext";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppearanceProvider>
          <NoteFiltersProvider>
            <HeroUIProvider navigate={navigate} useHref={useHref}>
              {children}
            </HeroUIProvider>
          </NoteFiltersProvider>
        </AppearanceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
