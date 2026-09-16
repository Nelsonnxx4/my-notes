import { Sun, Moon, Monitor } from "lucide-react";

import {
  useAppearance,
  type Theme,
  type FontSize,
} from "@/contexts/AppearanceContext";
import SettingField from "./ui/SettingsField";
import Toggle from "./ui/Toggle";

const AppearanceSettings: React.FC = () => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    compactMode,
    setCompactMode,
    showWordCount,
    setShowWordCount,
    lineNumbers,
    setLineNumbers,
  } = useAppearance();

  const themes: { id: Theme; label: string; icon: React.ElementType }[] = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  const sizes: { id: FontSize; label: string }[] = [
    { id: "sm", label: "S" },
    { id: "md", label: "M" },
    { id: "lg", label: "L" },
  ];

  return (
    <div className="w-full  space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3 dark:text-gray-100">Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-sm font-medium transition-all
                ${
                  theme === id
                    ? "border-green-400 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                }`}
              type="button"
              onClick={() => setTheme(id)}
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
              {theme === id && (
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3 dark:text-gray-100">
          Font size
        </h3>
        <div className="flex gap-2">
          {sizes.map(({ id, label }) => (
            <button
              key={id}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all
                ${
                  fontSize === id
                    ? "border-green-400 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                }`}
              type="button"
              onClick={() => setFontSize(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 dark:text-gray-500">
          Applies to the note editor.
        </p>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1 dark:text-gray-100">Editor</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <SettingField
            description="Reduce spacing between note cards"
            label="Compact mode"
          >
            <Toggle enabled={compactMode} onChange={setCompactMode} />
          </SettingField>
          <SettingField
            description="Show word and character count while editing"
            label="Word count"
          >
            <Toggle enabled={showWordCount} onChange={setShowWordCount} />
          </SettingField>
          <SettingField
            description="Show line count in the editor footer"
            label="Line numbers"
          >
            <Toggle enabled={lineNumbers} onChange={setLineNumbers} />
          </SettingField>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
