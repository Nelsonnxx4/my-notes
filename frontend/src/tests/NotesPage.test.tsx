import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import NotesPage from "@/pages/NotesPage";

vi.mock("@/api/notes.api");

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

test("renders NotesPage with notes", async () => {
  vi.mocked(notesApi.getNotes).mockResolvedValue([
    {
      id: "1",
      title: "My Note",
      content: "",
      tags: [],
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      userId: "u1",
      folderId: null,
    },
  ]);

  render(<NotesPage />, { wrapper });

  expect(await screen.findByText("My Note")).toBeInTheDocument();
});
