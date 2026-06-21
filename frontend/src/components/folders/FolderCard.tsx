interface Props {
  name: string;

  count: number;

  color: string;
}

export default function FolderCard({ name, count, color }: Props) {
  return (
    <div
      className="rounded-[24px] p-5"
      style={{
        backgroundColor: color,
      }}
    >
      <h3 className="font-bold text-lg">{name}</h3>

      <p className="mt-1 text-sm text-gray-600">{count} Notes</p>
    </div>
  );
}
