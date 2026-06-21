// components/notes/NoteCard.tsx

interface Props {
  title: string;
  content: string;
  color: string;
}

const NoteCard = ({ title, content, color }: Props) => {
  return (
    <article
      className="rounded-[28px] p-5 shadow-sm"
      style={{
        backgroundColor: color,
      }}
    >
      <h3 className="mb-3 text-lg font-bold">{title}</h3>

      <p className="line-clamp-5 text-sm text-gray-700">{content}</p>

      <div className="mt-4 text-xs text-gray-500">2h ago</div>
    </article>
  );
};

export default NoteCard;
