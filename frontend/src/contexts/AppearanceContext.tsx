import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type FontSize = "sm" | "md" | "lg";
export type GridLayout = "comfortable" | "compact";

interface AppearanceState {
  theme: Theme;
  fontSize: FontSize;
  compactMode: boolean;
  showWordCount: boolean;
  lineNumbers: boolean;
  gridLayout: GridLayout;
}

interface AppearanceContextValue extends AppearanceState {
  setTheme: (t: Theme) => void;
  setFontSize: (s: FontSize) => void;
  setCompactMode: (v: boolean) => void;
  setShowWordCount: (v: boolean) => void;
  setLineNumbers: (v: boolean) => void;
  setGridLayout: (g: GridLayout) => void;
}

const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
};

export function applyTheme(t: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = t === "dark" || (t === "system" && prefersDark);
  root.classList.toggle("dark", isDark);
  root.setAttribute("data-theme", isDark ? "dark" : "light");
}

function applyFontSize(s: FontSize) {
  document.documentElement.style.setProperty(
    "--editor-font-size",
    FONT_SIZE_MAP[s],
  );
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem("app:theme") as Theme) ?? "light",
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    () => (localStorage.getItem("app:fontSize") as FontSize) ?? "md",
  );
  const [compactMode, setCompactModeState] = useState(
    () => localStorage.getItem("app:compactMode") === "true",
  );
  const [showWordCount, setShowWordCountState] = useState(
    () => localStorage.getItem("app:showWordCount") !== "false",
  );
  const [lineNumbers, setLineNumbersState] = useState(
    () => localStorage.getItem("app:lineNumbers") === "true",
  );
  const [gridLayout, setGridLayoutState] = useState<GridLayout>(
    () => (localStorage.getItem("app:gridLayout") as GridLayout) ?? "comfortable",
  );

  // Apply on mount — index.html script prevents flash, this is a safety net
  useEffect(() => {
    applyTheme(theme);
    applyFontSize(fontSize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React to OS dark-mode changes when theme is "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("app:theme", t);
    applyTheme(t);
  }, []);

  const setFontSize = useCallback((s: FontSize) => {
    setFontSizeState(s);
    localStorage.setItem("app:fontSize", s);
    applyFontSize(s);
  }, []);

  const setCompactMode = useCallback((v: boolean) => {
    setCompactModeState(v);
    localStorage.setItem("app:compactMode", String(v));
  }, []);

  const setShowWordCount = useCallback((v: boolean) => {
    setShowWordCountState(v);
    localStorage.setItem("app:showWordCount", String(v));
  }, []);

  const setLineNumbers = useCallback((v: boolean) => {
    setLineNumbersState(v);
    localStorage.setItem("app:lineNumbers", String(v));
  }, []);

  const setGridLayout = useCallback((g: GridLayout) => {
    setGridLayoutState(g);
    localStorage.setItem("app:gridLayout", g);
  }, []);

  return (
    <AppearanceContext.Provider
      value={{
        theme,
        fontSize,
        compactMode,
        showWordCount,
        lineNumbers,
        gridLayout,
        setTheme,
        setFontSize,
        setCompactMode,
        setShowWordCount,
        setLineNumbers,
        setGridLayout,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx)
    throw new Error("useAppearance must be used within AppearanceProvider");
  return ctx;
}
