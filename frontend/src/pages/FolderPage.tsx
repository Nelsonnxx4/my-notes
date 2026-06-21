// pages/FolderPage.tsx

import FolderCard from "@/components/folders/FolderCard";

const folders = [
  {
    name: "Work",
    count: 23,
    color: "#FCEAA8",
  },
  {
    name: "Personal",
    count: 12,
    color: "#F7CBE9",
  },
  {
    name: "Travel",
    count: 8,
    color: "#CFEFFF",
  },
];

export default function FolderPage() {
  return (
    <main className="p-5">
      <h1 className="mb-6 text-3xl font-bold">Folders</h1>

      <div className="space-y-4">
        {folders.map((folder) => (
          <FolderCard key={folder.name} {...folder} />
        ))}
      </div>
    </main>
  );
}
