import { Notebook } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center py-24">
      <Notebook className="text-gray-300" size={64} />

      <h3 className="mt-4 text-xl font-semibold">No Notes Yet</h3>

      <p className="mt-2 text-gray-500">Tap + to create your first note.</p>
    </div>
  );
};

export default EmptyState;
