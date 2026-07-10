import { render, screen } from "@testing-library/react";

import FolderCard from "@/components/folders/FolderCard";

const blueScheme = {
  bg: "bg-blue-50",
  text: "text-blue-700",
  border: "border-blue-100",
  icon: "text-blue-400",
};

test("renders the folder title", () => {
  render(<FolderCard colorScheme={blueScheme} count={5} title="Work" />);

  expect(screen.getByText("Work")).toBeInTheDocument();
});

test("renders singular 'note' when count is 1", () => {
  render(<FolderCard colorScheme={blueScheme} count={1} title="Ideas" />);

  expect(screen.getByText("1 note")).toBeInTheDocument();
});

test("renders plural 'notes' when count is 0", () => {
  render(<FolderCard colorScheme={blueScheme} count={0} title="Empty" />);

  expect(screen.getByText("0 notes")).toBeInTheDocument();
});

test("renders plural 'notes' when count is greater than 1", () => {
  render(<FolderCard colorScheme={blueScheme} count={3} title="Projects" />);

  expect(screen.getByText("3 notes")).toBeInTheDocument();
});
