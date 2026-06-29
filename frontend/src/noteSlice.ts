import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  notes: [
    {
      id: 1,
      name: "nelson",
      heading: "How to eat better",
      text: "eating good food helps you stay fit and healthly, its does so much that you cant imagine",
    },
    {
      id: 2,
      name: "nelsonII",
      heading: "How to eat better",
      text: "eating good food helps you stay fit and healthly, its does so much that you cant imagine",
    },
  ],
};

interface CreateNotePayload {
  name: string;
  heading: string;
  text: string;
}

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    createNote: (state, action: PayloadAction<CreateNotePayload>) => {
      const newNote = {
        id:
          state.notes.length > 0
            ? state.notes[state.notes.length - 1].id + 1
            : 1,
        name: action.payload.name,
        heading: action.payload.heading,
        text: action.payload.text,
      };

      state.notes.push(newNote);
    },
    deleteNote: (state, action: PayloadAction<number>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
  },
});

export const { createNote, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
