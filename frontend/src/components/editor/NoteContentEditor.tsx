interface Props {
  value: string;
  onChange: (val: string) => void;
}

const NoteContentEditor = ({ value, onChange }: Props) => {
  return (
    <textarea
      className="min-h-125 w-full resize-none bg-transparent text-base leading-8 outline-none"
      placeholder="Start writing..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default NoteContentEditor;
