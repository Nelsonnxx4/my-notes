import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createNote } from "@/noteSlice";

interface NoteFormData {
  name: string;
  heading: string;
  text: string;
}

const CreateNotesPage: React.FC = () => {
  const [noteData, setNoteData] = useState<NoteFormData>({
    name: "",
    heading: "",
    text: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNoteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (noteData.name && noteData.heading && noteData.text) {
      dispatch(createNote(noteData));

      setNoteData({
        name: "",
        heading: "",
        text: "",
      });

      navigate("/");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <main>
      <h1>Create Notes</h1>

      <form onSubmit={handleCreateNote}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            placeholder="Enter your name"
            type="text"
            value={noteData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="heading">Heading:</label>
          <input
            id="heading"
            name="heading"
            placeholder="Enter note heading"
            type="text"
            value={noteData.heading}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="text">Note Text:</label>
          <textarea
            id="text"
            name="text"
            placeholder="Enter your note"
            rows={5}
            value={noteData.text}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Create Note</button>
      </form>
    </main>
  );
};

export default CreateNotesPage;
