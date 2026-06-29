import { useState } from "react";
import { motion } from "framer-motion";
import { User, Palette, Cloud, Trash2, ChevronRight } from "lucide-react";

import AccountSettings from "@/components/settings/AccountSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import DataSettings from "@/components/settings/DataSettings";
import SyncSettings from "@/components/settings/SyncSettings";

type Section = "account" | "appearance" | "sync" | "data";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
    {children}
  </h2>
);

const SettingRow: React.FC<{
  icon: React.ElementType;
  label: string;
  description?: string;
  active?: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, description, active, onClick }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left group
      ${
        active
          ? "bg-green-50 border border-green-300"
          : "hover:bg-gray-50 border border-transparent"
      }`}
    onClick={onClick}
  >
    <span
      className={`flex items-center justify-center h-8 w-8 rounded-lg shrink-0 transition-colors
        ${active ? "bg-green-400 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}
    >
      <Icon size={15} strokeWidth={1.8} />
    </span>
    <span className="flex flex-col flex-1 min-w-0">
      <span
        className={`text-sm font-medium ${active ? "text-green-700" : "text-gray-700"}`}
      >
        {label}
      </span>
      {description && (
        <span className="text-xs text-gray-400 truncate">{description}</span>
      )}
    </span>
    <ChevronRight
      className={`shrink-0 transition-colors ${active ? "text-green-400" : "text-gray-300 group-hover:text-gray-400"}`}
      size={14}
      strokeWidth={2}
    />
  </button>
);

const NAV: {
  id: Section;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    id: "account",
    label: "Account",
    icon: User,
    description: "Profile & sign-in",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Theme & editor",
  },

  { id: "sync", label: "Sync", icon: Cloud, description: "Cloud & devices" },
  {
    id: "data",
    label: "Data & storage",
    icon: Trash2,
    description: "Export & delete",
  },
];

const PANELS: Record<Section, React.ReactNode> = {
  account: <AccountSettings />,
  appearance: <AppearanceSettings />,
  sync: <SyncSettings />,
  data: <DataSettings />,
};

const SettingsPage: React.FC = () => {
  const [active, setActive] = useState<Section>("account");

  const activeNav = NAV.find((n) => n.id === active)!;

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-14">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage your account and app preferences.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-56 shrink-0 space-y-1"
          initial={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <SectionTitle>Preferences</SectionTitle>
          {NAV.map(({ id, label, icon, description }) => (
            <SettingRow
              key={id}
              active={active === id}
              description={description}
              icon={icon}
              label={label}
              onClick={() => setActive(id)}
            />
          ))}
        </motion.aside>

        <motion.section
          key={active}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-w-0 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-2 pb-4 border-b border-gray-100">
            <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-green-400">
              <activeNav.icon
                className="text-white"
                size={16}
                strokeWidth={1.8}
              />
            </span>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                {activeNav.label}
              </h2>
              <p className="text-xs text-gray-400">{activeNav.description}</p>
            </div>
          </div>

          {PANELS[active]}
        </motion.section>
      </div>
    </main>
  );
};

export default SettingsPage;
