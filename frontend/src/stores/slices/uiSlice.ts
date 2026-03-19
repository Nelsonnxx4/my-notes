import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  selectedNoteId: string | null;
  sidebarOpen: boolean;
  activeTagId: number | null;
  searchQuery: string;
  viewMode: "grid" | "list";
  isEditing: boolean;
}

const initialState: UIState = {
  selectedNoteId: null,
  sidebarOpen: true,
  activeTagId: null,
  searchQuery: "",
  viewMode: "grid",
  isEditing: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectNote: (state, action: PayloadAction<string | null>) => {
      state.selectedNoteId = action.payload;
      state.isEditing = false;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveTag: (state, action: PayloadAction<number | null>) => {
      state.activeTagId = action.payload;
      state.selectedNoteId = null; // reset selected note on tag change
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
  },
});

export const {
  selectNote,
  toggleSidebar,
  setActiveTag,
  setSearchQuery,
  setViewMode,
  setIsEditing,
} = uiSlice.actions;

export default uiSlice.reducer;
