import { renderHook, act } from "@testing-library/react";

import {
  AppearanceProvider,
  useAppearance,
} from "@/contexts/AppearanceContext";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppearanceProvider>{children}</AppearanceProvider>
);

test("should set theme between light, dark, and system", () => {
  const { result } = renderHook(() => useAppearance(), { wrapper });

  act(() => result.current.setTheme("dark"));

  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(localStorage.getItem("app:theme")).toBe("dark");

  act(() => result.current.setFontSize("lg"));

  expect(
    document.documentElement.style.getPropertyValue("--editor-font-size"),
  ).toBe("1.125rem");
});
