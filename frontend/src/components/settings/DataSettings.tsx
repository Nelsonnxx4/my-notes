import { useState } from "react";
import { Download, Trash2 } from "lucide-react";

const DataSettings = () => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Export</h3>
        <p className="text-xs text-gray-400 mb-3">
          Download a copy of all your notes and folders.
        </p>
        <div className="space-y-2">
          {[
            { fmt: "Markdown (.md)", desc: "Best for most apps" },
            { fmt: "Plain text (.txt)", desc: "Universal format" },
            { fmt: "JSON", desc: "For developers" },
          ].map(({ fmt, desc }) => (
            <button
              key={fmt}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition group"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{fmt}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Download
                className="text-gray-300 group-hover:text-green-400 transition"
                size={15}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Storage</h3>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>24 MB used</span>
            <span>1 GB total</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-[2.4%] rounded-full bg-green-400" />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-red-500 mb-1">
          Danger zone
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          These actions are permanent and cannot be undone.
        </p>

        {!showConfirm ? (
          <button
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 size={15} strokeWidth={1.5} />
            Delete all notes
          </button>
        ) : (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
            <p className="text-sm text-red-600 font-medium">
              Are you sure? This will permanently delete all your notes.
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50 transition"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition">
                Yes, delete all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSettings;
