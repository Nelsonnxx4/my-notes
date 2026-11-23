import { Check, CloudOff, RefreshCw, TriangleAlert } from "lucide-react";

import { useSyncStatus } from "@/contexts/SyncStatusContext";

export default function SyncStatus() {
  const { state, pendingCount, flush } = useSyncStatus();
  const config = {
    saved: { label: "Saved", icon: Check },
    saving: { label: "Saving", icon: RefreshCw },
    offline: { label: pendingCount ? `${pendingCount} queued` : "Offline", icon: CloudOff },
    error: { label: "Retry sync", icon: TriangleAlert },
  }[state];
  const Icon = config.icon;

  return (
    <button
      aria-label={config.label}
      className="flex h-8 items-center gap-1.5 rounded-[var(--app-radius-control)] px-2 text-xs text-[var(--app-muted)] hover:bg-[var(--app-raised)] hover:text-[var(--app-text)]"
      type="button"
      onClick={() => void flush()}
    >
      <Icon className={state === "saving" ? "animate-spin" : ""} size={14} strokeWidth={1.6} />
      <span>{config.label}</span>
    </button>
  );
}
