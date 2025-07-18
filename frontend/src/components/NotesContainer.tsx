import { EditIcon } from "@/assets/icons";
import { DummyNotes } from "@/constant/constants";

interface INotesContainerProps {}

const NotesContainer: React.FC<INotesContainerProps> = () => {
  return (
    <main className="grid grid-cols-2 gap-3 px-1.5 py-4">
      {DummyNotes.map((data) => (
        <article
          key={data.noteId}
          className="bg-[#f8f8f8] p-2 rounded-md shadow-sm"
        >
          <h2 className="font-semibold text-[18px] leading-5 pb-3">
            {data.heading}
          </h2>

          <p className="text-[16px] leading-5 text-[#a3a8b1]">{data.text}</p>

          <div className="flex justify-between items-center">
            <span className="underline text-indigo-700">{data.name}</span>
            <EditIcon height={20} width={20} />
          </div>
        </article>
      ))}
    </main>
  );
};

export default NotesContainer;
