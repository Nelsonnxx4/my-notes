import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import FolderCard from "@/components/folders/FolderCard";

test("renders folder card with correct title and description", () => {
  const folder = {
    title: "Test Folder",
    count: 5,
    colorScheme: "blue",
  } as const;

  render(<FolderCard {...folder} onOpen={vi.fn()} />);

  expect(screen.getByText("Test Folder")).toBeInTheDocument();
  expect(screen.getByText("This is a test folder.")).toBeInTheDocument();
  expect(screen.getByText("5 notes")).toBeInTheDocument();
});

test("calls onOpen when clicked", async () => {
  const onOpen = vi.fn();

  render(
    <FolderCard
      folder={{
        title: "Work",
        count: 0,
        colorScheme: "blue",
      }}
      onOpen={onOpen}
    />,
  );

  await userEvent.click(screen.getByText("Work"));
  expect(onOpen).toHaveBeenCalledWith("1");
});
