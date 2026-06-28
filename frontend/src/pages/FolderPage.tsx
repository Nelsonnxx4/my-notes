import { motion } from "framer-motion";
import { FolderPlusIcon } from "lucide-react";

import FolderCard from "@/components/folders/FolderCard";
import { folders } from "@/constant/folderConstants";

export const FOLDER_COLORS = [
  {
    bg: "bg-[#fc843e18]",
    text: "text-[#c45a1a]",
    border: "border-[#fc843e50]",
    icon: "text-[#fc843e]",
  },
  {
    bg: "bg-[#D7B0CB18]",
    text: "text-[#9b5c88]",
    border: "border-[#D7B0CB50]",
    icon: "text-[#c47fb0]",
  },
  {
    bg: "bg-[#34d399]",
    text: "text-[#0f9e6a]",
    border: "border-[#34d39950]",
    icon: "text-[#34d399]",
  },
  {
    bg: "bg-[#D1F5E0]",
    text: "text-[#2e8b57]",
    border: "border-[#D1F5E050]",
    icon: "text-[#5fcf8a]",
  },
  {
    bg: "bg-[#FFE4D6]",
    text: "text-[#c4601a]",
    border: "border-[#FFE4D650]",
    icon: "text-[#f0944d]",
  },
  {
    bg: "bg-[#f6ec3318]",
    text: "text-[#a08a00]",
    border: "border-[#f6ec3350]",
    icon: "text-[#d4c220]",
  },
  {
    bg: "bg-[#926bf418]",
    text: "text-[#6b3fcf]",
    border: "border-[#926bf450]",
    icon: "text-[#926bf4]",
  },
  {
    bg: "bg-[#E03F4018]",
    text: "text-[#b52b2b]",
    border: "border-[#E03F4050]",
    icon: "text-[#e05c5c]",
  },
];

function hashIndex(str: string, len: number): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash) % len;
}

const foldersWithColors = folders.map((folder) => ({
  ...folder,
  colorScheme: FOLDER_COLORS[hashIndex(folder.title, FOLDER_COLORS.length)],
}));

const FolderPage: React.FC = () => {
  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-20">
      <section className="flex flex-wrap justify-start items-start gap-3">
        {foldersWithColors.map((folder, i) => (
          <motion.div
            key={folder.title}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <FolderCard
              count={2}
              {...folder}
              colorScheme={folder.colorScheme}
            />
          </motion.div>
        ))}

        {/* Add folder button — neutral to not compete with colored cards */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center p-4 bg-gray-100 md:min-w-50 md:min-h-50 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
          initial={{ opacity: 0, y: 5 }}
          transition={{
            duration: 0.35,
            delay: foldersWithColors.length * 0.05,
          }}
        >
          <FolderPlusIcon className="text-gray-400" size={50} strokeWidth={1} />
        </motion.div>
      </section>
    </main>
  );
};

export default FolderPage;
