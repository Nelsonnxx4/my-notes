import { type ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";

import {
  AppearanceProvider,
  useAppearance,
} from "@/contexts/AppearanceContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppearanceProvider>{children}</AppearanceProvider>
);

test("applies dark theme class and persists to localStorage", () => {
  const { result } = renderHook(() => useAppearance(), { wrapper });

  act(() => result.current.setTheme("dark"));

  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(localStorage.getItem("app:theme")).toBe("dark");
});

test("applies font size CSS variable and persists to localStorage", () => {
  const { result } = renderHook(() => useAppearance(), { wrapper });

  act(() => result.current.setFontSize("lg"));

  expect(
    document.documentElement.style.getPropertyValue("--editor-font-size"),
  ).toBe("1.125rem");
  expect(localStorage.getItem("app:fontSize")).toBe("lg");
});

test("toggles compact mode and persists to localStorage", () => {
  const { result } = renderHook(() => useAppearance(), { wrapper });

  act(() => result.current.setCompactMode(true));

  expect(result.current.compactMode).toBe(true);
  expect(localStorage.getItem("app:compactMode")).toBe("true");
});
