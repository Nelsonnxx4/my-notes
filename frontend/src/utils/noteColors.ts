export const NOTE_COLORS = [
  "bg-[#fc843e96]",
  "bg-[#D7B0CB96]",
  "bg-[#34d39996]",
  "bg-[#D1F5E096]",
  "bg-[#FFE4D696]",
  "bg-[#f6ec3396]",
  "bg-[#926bf496]",
  "bg-[#E03F4096]",
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
