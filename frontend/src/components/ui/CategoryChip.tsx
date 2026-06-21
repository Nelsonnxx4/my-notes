// components/ui/CategoryChip.tsx

interface Props {
  title: string;
  active?: boolean;
}

export default function CategoryChip({ title, active }: Props) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
          : "bg-white text-slate-700 shadow-sm"
      }`}
    >
      {title}
    </button>
  );
}
