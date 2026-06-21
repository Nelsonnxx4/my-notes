// components/ui/CategoryChip.tsx

interface Props {
  title: string;
  active?: boolean;
}

export default function CategoryChip({ title, active }: Props) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        active ? "bg-primary text-white" : "bg-white text-gray-700"
      }`}
    >
      {title}
    </button>
  );
}
