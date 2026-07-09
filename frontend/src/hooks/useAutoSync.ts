import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const SYNC_INTERVAL_MS = 30_000;

export function useAutoSync() {
  const queryClient = useQueryClient();
  const [autoSync, setAutoSync] = useState(
    () => localStorage.getItem("app:autoSync") !== "false",
  );

  // React to toggle changes dispatched by SyncSettings
  useEffect(() => {
    const handler = (e: Event) =>
      setAutoSync((e as CustomEvent<boolean>).detail);
    window.addEventListener("app:autoSync", handler);
    return () => window.removeEventListener("app:autoSync", handler);
  }, []);

  useEffect(() => {
    if (!autoSync) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    }, SYNC_INTERVAL_MS);
    return () => clearInterval(id);
  }, [autoSync, queryClient]);
}
