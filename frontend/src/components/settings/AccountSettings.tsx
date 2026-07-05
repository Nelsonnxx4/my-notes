import { useState } from "react";
import { Check, LogOut } from "lucide-react";
import { Input } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

const DISPLAY_NAME_KEY = "app:displayName";

const inputClasses = {
  label: "text-xs font-medium text-gray-500 uppercase tracking-wide",
  inputWrapper:
    "outline-none px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-300 transition",
  input: "text-sm",
};

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const emailPrefix = user?.email?.split("@")[0] ?? "User";

  const [name, setName] = useState<string>(
    () => localStorage.getItem(DISPLAY_NAME_KEY) ?? emailPrefix,
  );
  const [saved, setSaved] = useState(false);

  function save() {
    const trimmed = name.trim() || emailPrefix;
    localStorage.setItem(DISPLAY_NAME_KEY, trimmed);
    setName(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSignOut() {
    logout();
    navigate("/auth/login", { replace: true });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-4">Profile</h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-green-100 ring-2 ring-green-200 flex items-center justify-center text-green-700 text-xl font-bold select-none">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-400 border-2 border-white" />
          </div>
        </div>

        <div className="md:w-80 space-y-3">
          <Input
            classNames={inputClasses}
            label="Display name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            classNames={inputClasses}
            description="Your sign-in email — cannot be changed here."
            isReadOnly
            // label="Email"
            type="email"
            value={user?.email ?? ""}
          />
        </div>

        <button
          className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            saved
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-green-600 hover:bg-green-600/85 border border-green-400 text-white"
          }`}
          onClick={save}
        >
          {saved && <Check size={14} strokeWidth={2.5} />}
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Account</h3>
        <div className="md:w-60 space-y-1">
          <button
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut size={15} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
