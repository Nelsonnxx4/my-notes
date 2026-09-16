export const NOTE_COLORS = [
  "bg-[#d95f21]",
  "bg-[#a85f92]",
  "bg-[#059669]",
  "bg-[#32a66b]",
  "bg-[#d98247]",
  "bg-[#c6a80d]",
  "bg-[#7148d8]",
  "bg-[#c92f34]",
];

export const hashColor = (str: string): string => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return NOTE_COLORS[Math.abs(hash) % NOTE_COLORS.length];
};

export const hashIndex = (str: string, len: number): number => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash) % len;
};
