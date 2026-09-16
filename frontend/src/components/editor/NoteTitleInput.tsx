interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function NoteTitleInput({ value, onChange }: Props) {
  return (
    <textarea
      className="mb-6 w-full resize-none bg-transparent text-4xl font-bold outline-none leading-tight text-gray-900 placeholder:text-gray-300 dark:text-gray-100 dark:placeholder:text-gray-700"
      placeholder="Untitled Note"
      rows={2}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
