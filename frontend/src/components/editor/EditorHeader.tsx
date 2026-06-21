import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditorHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-5">
      <button
        aria-label="Go back"
        className="rounded-full bg-white p-3"
        title="Go back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
      </button>

      <button
        aria-label="More options"
        className="rounded-full bg-white p-3"
        title="More options"
      >
        <MoreVertical size={20} />
      </button>
    </header>
  );
};

export default EditorHeader;
