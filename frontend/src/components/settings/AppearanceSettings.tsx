import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

import SettingField from "./ui/SettingsField";
import Toggle from "./ui/Toggle";

type Theme = "light" | "dark" | "system";
type FontSize = "sm" | "md" | "lg";

function applyTheme(t: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = t === "dark" || (t === "system" && prefersDark);

  root.classList.toggle("dark", isDark);
  root.setAttribute("data-theme", isDark ? "dark" : "light");
}

const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("app:theme") as Theme) ?? "light",
  );
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem("app:fontSize") as FontSize) ?? "md",
  );
  const [compactMode, setCompactMode] = useState(
    () => localStorage.getItem("app:compactMode") === "true",
  );
  const [showWordCount, setShowWordCount] = useState(
    () => localStorage.getItem("app:showWordCount") !== "false",
  );
  const [lineNumbers, setLineNumbers] = useState(
    () => localStorage.getItem("app:lineNumbers") === "true",
  );

  // Apply saved theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  function handleTheme(t: Theme) {
    setTheme(t);
    localStorage.setItem("app:theme", t);
    applyTheme(t);
  }

  function handleFontSize(s: FontSize) {
    setFontSize(s);
    localStorage.setItem("app:fontSize", s);
  }

  function handleCompact(v: boolean) {
    setCompactMode(v);
    localStorage.setItem("app:compactMode", String(v));
  }

  function handleWordCount(v: boolean) {
    setShowWordCount(v);
    localStorage.setItem("app:showWordCount", String(v));
  }

  function handleLineNumbers(v: boolean) {
    setLineNumbers(v);
    localStorage.setItem("app:lineNumbers", String(v));
  }

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
              type="button"
              onClick={() => handleTheme(id)}
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
              type="button"
              onClick={() => handleFontSize(id)}
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
            <Toggle enabled={compactMode} onChange={handleCompact} />
          </SettingField>
          <SettingField
            description="Show word count in the editor"
            label="Word count"
          >
            <Toggle enabled={showWordCount} onChange={handleWordCount} />
          </SettingField>
          <SettingField
            description="Show line numbers while editing"
            label="Line numbers"
          >
            <Toggle enabled={lineNumbers} onChange={handleLineNumbers} />
          </SettingField>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
