const CHANNEL_NAME = "notlify:notes";
const EVENT_NAME = "notlify:notes-changed";

let channel: BroadcastChannel | null = null;

function getChannel() {
  if (typeof BroadcastChannel === "undefined") return null;
  channel ??= new BroadcastChannel(CHANNEL_NAME);

  return channel;
}

export function broadcastNotesChanged() {
  getChannel()?.postMessage({ type: "notes-changed", sentAt: Date.now() });
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function listenForNoteChanges(listener: () => void) {
  const onMessage = () => listener();
  const activeChannel = getChannel();
  activeChannel?.addEventListener("message", onMessage);
  window.addEventListener(EVENT_NAME, listener);

  return () => {
    activeChannel?.removeEventListener("message", onMessage);
    window.removeEventListener(EVENT_NAME, listener);
  };
}
