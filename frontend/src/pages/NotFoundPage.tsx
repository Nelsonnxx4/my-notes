import { motion } from "framer-motion";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <main className="min-h-screen bg-[#F7F7FA] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative mb-6">
          <span className="text-[120px] font-black leading-none text-gray-100 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shadow-sm">
              <FileQuestion
                className="text-green-400"
                size={28}
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page not found
        </h1>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
          <code className="text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 font-mono">
            {pathname}
          </code>{" "}
          doesn't exist. It may have been moved or the link is wrong.
        </p>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition shadow-sm cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Go back
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-600/85 transition shadow-sm cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Home
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFoundPage;
