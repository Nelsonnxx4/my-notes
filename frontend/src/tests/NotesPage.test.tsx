import { type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { AppearanceProvider } from "@/contexts/AppearanceContext";
import { NoteFiltersProvider } from "@/contexts/NoteFiltersContext";
import NotesPage from "@/pages/NotesPage";

vi.mock("@/hooks/queries/useNotes", () => ({
  useNotes: vi.fn(() => ({
    data: [
      {
        id: "1",
        title: "My Note",
        content: "",
        tags: [],
        isPinned: false,
        isFavorite: false,
        isArchived: false,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        userId: "u1",
        folderId: null,
      },
    ],
    isLoading: false,
  })),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>
      <AppearanceProvider>
        <NoteFiltersProvider>{children}</NoteFiltersProvider>
      </AppearanceProvider>
    </MemoryRouter>
  </QueryClientProvider>
);

test("renders notes returned by the hook", async () => {
  render(<NotesPage />, { wrapper });

  expect(await screen.findByText("My Note")).toBeInTheDocument();
});

test("shows empty state when there are no notes", async () => {
  const { useNotes } = await import("@/hooks/queries/useNotes");
  vi.mocked(useNotes).mockReturnValueOnce({
    data: [],
    isLoading: false,
  } as unknown as ReturnType<typeof useNotes>);

  render(<NotesPage />, { wrapper });

  expect(await screen.findByText("No notes yet")).toBeInTheDocument();
});
