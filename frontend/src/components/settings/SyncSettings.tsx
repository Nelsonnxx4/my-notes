import { useEffect, useRef, useState } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import { useQueryClient, useIsFetching, useIsMutating } from "@tanstack/react-query";

import SettingField from "./ui/SettingsField";
import Toggle from "./ui/Toggle";

const LAST_SYNCED_KEY = "app:lastSynced";

function formatLastSynced(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) {
    return `Today at ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }

  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

const SyncSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isSyncing = isFetching > 0 || isMutating > 0;

  const [autoSync, setAutoSync] = useState(
    () => localStorage.getItem("app:autoSync") !== "false",
  );
  const [syncOnWifi, setSyncOnWifi] = useState(
    () => localStorage.getItem("app:syncOnWifi") !== "false",
  );
  const [lastSynced, setLastSynced] = useState<string | null>(
    () => localStorage.getItem(LAST_SYNCED_KEY),
  );
  const [justSynced, setJustSynced] = useState(false);
  const wasSyncing = useRef(false);

  useEffect(() => {
    if (isSyncing) {
      wasSyncing.current = true;
      setJustSynced(false);
      return;
    }
    if (wasSyncing.current) {
      wasSyncing.current = false;
      const now = new Date().toISOString();
      localStorage.setItem(LAST_SYNCED_KEY, now);
      setLastSynced(now);
      setJustSynced(true);
      const t = setTimeout(() => setJustSynced(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isSyncing]);

  function handleAutoSync(v: boolean) {
    setAutoSync(v);
    localStorage.setItem("app:autoSync", String(v));
  }

  function handleSyncOnWifi(v: boolean) {
    setSyncOnWifi(v);
    localStorage.setItem("app:syncOnWifi", String(v));
  }

  function handleSyncNow() {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    queryClient.invalidateQueries({ queryKey: ["folders"] });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  }

  return (
    <div className="space-y-6">
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
          justSynced
            ? "bg-green-50 border-green-200"
            : isSyncing
              ? "bg-blue-50 border-blue-200"
              : "bg-green-50 border-green-200"
        }`}
      >
        {isSyncing ? (
          <RefreshCw
            className="h-4 w-4 text-blue-500 animate-spin shrink-0"
            strokeWidth={1.5}
          />
        ) : justSynced ? (
          <CheckCircle
            className="h-4 w-4 text-green-500 shrink-0"
            strokeWidth={1.5}
          />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 shrink-0 animate-pulse" />
        )}
        <div>
          <p
            className={`text-sm font-medium ${isSyncing ? "text-blue-700" : "text-green-700"}`}
          >
            {isSyncing ? "Syncing…" : justSynced ? "Synced" : "Sync is on"}
          </p>
          <p
            className={`text-xs ${isSyncing ? "text-blue-600" : "text-green-600"}`}
          >
            Last synced {formatLastSynced(lastSynced)}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Preferences
        </h3>
        <div className="divide-y divide-gray-100">
          <SettingField
            description="Keep notes up to date automatically"
            label="Auto-sync"
          >
            <Toggle enabled={autoSync} onChange={handleAutoSync} />
          </SettingField>
          <SettingField
            description="Don't sync over mobile data"
            label="Wi-Fi only"
          >
            <Toggle enabled={syncOnWifi} onChange={handleSyncOnWifi} />
          </SettingField>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Actions</h3>
        <div className="space-y-2">
          <button
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={isSyncing}
            type="button"
            onClick={handleSyncNow}
          >
            <RefreshCw
              className={`text-gray-400 ${isSyncing ? "animate-spin" : ""}`}
              size={15}
              strokeWidth={1.5}
            />
            {isSyncing ? "Syncing…" : "Sync now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncSettings;
