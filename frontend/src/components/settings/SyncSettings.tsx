import { useState } from "react";
import { Cloud } from "lucide-react";

import SettingField from "./ui/SettingsField";
import Toggle from "./ui/Toggle";

const SyncSettings: React.FC = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [syncOnWifi, setSyncOnWifi] = useState(true);
  const [lastSynced] = useState("Today at 2:41 PM");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
        <span className="h-2.5 w-2.5 rounded-full bg-green-400 shrink-0 animate-pulse" />
        <div>
          <p className="text-sm font-medium text-green-700">Sync is on</p>
          <p className="text-xs text-green-600">Last synced {lastSynced}</p>
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
            <Toggle enabled={autoSync} onChange={setAutoSync} />
          </SettingField>
          <SettingField
            description="Don't sync over mobile data"
            label="Wi-Fi only"
          >
            <Toggle enabled={syncOnWifi} onChange={setSyncOnWifi} />
          </SettingField>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Actions</h3>
        <div className="space-y-2">
          <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition border border-gray-200">
            <Cloud className="text-gray-400" size={15} strokeWidth={1.5} />
            Sync now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncSettings;
