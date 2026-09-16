import type { NavigateOptions } from "react-router-dom";

import { ToastProvider } from "@heroui/react";
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
              <ToastProvider
                placement="top-right"
                toastProps={{
                  radius: "md",
                  timeout: 5000,
                  shouldShowTimeoutProgress: true,
                }}
              />
            </HeroUIProvider>
          </NoteFiltersProvider>
        </AppearanceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
