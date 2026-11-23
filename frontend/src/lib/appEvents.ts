const OPEN_COMMAND_PALETTE_EVENT = "notlify:open-command-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT));
}

export function listenForCommandPaletteOpen(listener: () => void) {
  window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, listener);

  return () => window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, listener);
}
