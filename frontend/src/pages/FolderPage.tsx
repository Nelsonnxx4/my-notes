import { motion } from "framer-motion";
import { FolderPlusIcon } from "lucide-react";

import FolderCard from "@/components/folders/FolderCard";
import { folders } from "@/constant/folderConstants";

const FolderPage: React.FC = () => {
  const colors = [
    "bg-[#fc843e96]",
    "bg-[#D7B0CB96]",
    "bg-[#34d39996]",
    "bg-[#D1F5E096]",
    "bg-[#FFE4D696]",
    "bg-[#f6ec3396]",
    "bg-[#926bf496]",
    "bg-[#E03F4096]",
  ];

  const foldersWithColors = folders.map((folder) => ({
    ...folder,
    color: (() => {
      let hash = 0;

      for (let i = 0; i < folder.title.length; i++) {
        const char = folder.title.charCodeAt(i);

        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }

      return colors[Math.abs(hash) % colors.length];
    })(),
  }));

  return (
    <main className="py-20">
      <section className="flex justify-start items-center gap-2">
        {foldersWithColors.map((folder) => (
          <motion.div
            key={folder.title}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.35 }}
          >
            <FolderCard count={2} {...folder} color={folder.color} />
          </motion.div>
        ))}

        <div className="flex justify-center items-center p-4 bg-gray-100 md:min-w-50 md:min-h-50 border border-accent-100 outline-2 outline-accent-100 outline-offset-2 rounded-md cursor-pointer hover:bg-gray-100/80 transition-all duration-75">
          <FolderPlusIcon className="text-gray-500" size={50} strokeWidth={1} />
        </div>
      </section>
    </main>
  );
};

export default FolderPage;
