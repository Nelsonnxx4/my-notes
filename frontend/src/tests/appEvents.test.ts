import { describe, expect, it, vi } from "vitest";

import { listenForCommandPaletteOpen, openCommandPalette } from "@/lib/appEvents";

describe("command palette events", () => {
  it("opens from controls outside the palette", () => {
    const listener = vi.fn();
    const stopListening = listenForCommandPaletteOpen(listener);

    openCommandPalette();
    expect(listener).toHaveBeenCalledOnce();

    stopListening();
    openCommandPalette();
    expect(listener).toHaveBeenCalledOnce();
  });
});
