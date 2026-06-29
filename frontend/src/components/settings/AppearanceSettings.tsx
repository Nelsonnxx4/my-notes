import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

import SettingField from "./ui/SettingsField";
import Toggle from "./ui/Toggle";

const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [showWordCount, setShowWordCount] = useState<boolean>(true);
  const [lineNumbers, setLineNumbers] = useState<boolean>(false);

  const themes = [
    { id: "light" as const, label: "Light", icon: Sun },
    { id: "dark" as const, label: "Dark", icon: Moon },
    { id: "system" as const, label: "System", icon: Monitor },
  ];

  const sizes = [
    { id: "sm" as const, label: "S" },
    { id: "md" as const, label: "M" },
    { id: "lg" as const, label: "L" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-sm font-medium transition-all
                ${
                  theme === id
                    ? "border-green-400 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
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

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Font size
        </h3>
        <div className="flex gap-2">
          {sizes.map(({ id, label }) => (
            <button
              key={id}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all
                ${
                  fontSize === id
                    ? "border-green-400 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              onClick={() => setFontSize(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Editor</h3>
        <div className="divide-y divide-gray-100">
          <SettingField
            description="Reduce spacing between notes"
            label="Compact mode"
          >
            <Toggle enabled={compactMode} onChange={setCompactMode} />
          </SettingField>
          <SettingField
            description="Show word count in the editor"
            label="Word count"
          >
            <Toggle enabled={showWordCount} onChange={setShowWordCount} />
          </SettingField>
          <SettingField
            description="Show line numbers while editing"
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
