import { useSelector } from "react-redux";

import { EditIcon } from "@/assets/icons";

interface INotesContainerProps {}

const NotesContainer: React.FC<INotesContainerProps> = () => {
  const notes = useSelector((state: any) => state.notes.notes);

  return (
    <main className="grid grid-cols-2 gap-3 px-1.5 py-4">
      {notes.map((note) => (
        <article
          key={note.id}
          className="bg-[#f8f8f8] p-2 rounded-md shadow-sm"
        >
          <h2 className="font-semibold text-[18px] leading-5 pb-3">
            {note.heading}
          </h2>

          <p className="text-[16px] leading-5 text-[#a3a8b1]">{note.text}</p>

          <div className="flex justify-between items-center">
            <span className="underline text-indigo-700">{note.name}</span>
            <EditIcon height={20} width={20} />
          </div>
        </article>
      ))}
    </main>
  );
};

export default NotesContainer;
