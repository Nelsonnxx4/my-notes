import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Palette,
  Cloud,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import AccountSettings from "@/components/settings/AccountSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import DataSettings from "@/components/settings/DataSettings";
import SyncSettings from "@/components/settings/SyncSettings";

type Section = "account" | "appearance" | "sync" | "data";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="mb-2 px-1 text-sm font-medium text-[var(--app-muted)]">
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
    className={`group flex w-full items-center gap-3 rounded-[var(--app-radius-card)] border px-3 py-3 text-left
      ${
        active
          ? "border-[var(--app-control)] bg-[var(--app-active)]"
          : "border-transparent hover:bg-[var(--app-raised)]"
      }`}
    onClick={onClick}
  >
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--app-radius-control)]
        ${active ? "bg-[var(--app-text)] text-[var(--app-ground)]" : "bg-[var(--app-raised)] text-[var(--app-muted)]"}`}
    >
      <Icon size={15} strokeWidth={1.8} />
    </span>
    <span className="flex flex-col flex-1 min-w-0">
      <span className="text-sm font-medium text-[var(--app-text)]">
        {label}
      </span>
      {description && (
        <span className="truncate text-xs text-[var(--app-faint)]">
          {description}
        </span>
      )}
    </span>
    <ChevronRight
      className="shrink-0 text-[var(--app-faint)]"
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
    label: "Data",
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
  const [showPanel, setShowPanel] = useState(false);
  const [direction, setDirection] = useState(1);

  const activeNav = NAV.find((n) => n.id === active)!;

  function handleNavClick(id: Section) {
    setDirection(
      Math.sign(
        NAV.findIndex((item) => item.id === id) -
          NAV.findIndex((item) => item.id === active),
      ) || 1,
    );
    setActive(id);
    setShowPanel(true);
  }

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 pt-20 pb-28 md:pt-32">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
        initial={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          Manage your account and app preferences.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <motion.aside
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className={`w-full md:w-56 shrink-0 space-y-1 ${showPanel ? "hidden md:block" : "block"}`}
          initial={{ opacity: 0, scale: 0.97 }}
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
              onClick={() => handleNavClick(id)}
            />
          ))}
        </motion.aside>

        <motion.section
          key={active}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className={`-mx-4 w-full flex-1 border border-[var(--app-border)] bg-[var(--app-surface)] p-5 md:mx-0 md:min-w-0 md:rounded-[var(--app-radius-card)] md:p-6 ${
            showPanel ? "block" : "hidden md:block"
          }`}
          initial={{ opacity: 0, scale: 0.97, x: direction * 28 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            className="mb-4 -ml-1 flex items-center gap-1 text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] md:hidden"
            onClick={() => setShowPanel(false)}
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Back
          </button>

          <div className="mb-2 flex items-center gap-3 border-b border-[var(--app-rule)] pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--app-radius-control)] bg-[var(--app-text)]">
              <activeNav.icon
                className="text-white"
                size={16}
                strokeWidth={1.8}
              />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--app-text)]">
                {activeNav.label}
              </h2>
              <p className="text-xs text-[var(--app-faint)]">
                {activeNav.description}
              </p>
            </div>
          </div>

          {PANELS[active]}
        </motion.section>
      </div>
    </main>
  );
};

export default SettingsPage;
