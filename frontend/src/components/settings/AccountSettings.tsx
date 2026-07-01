import { useState } from "react";
import { Check, LogOut, Shield } from "lucide-react";
import { Label, Input } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string>(
    user?.email?.split("@")[0] ?? "User",
  );
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [saved, setSaved] = useState<boolean>(false);

  function save() {
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
            <div className="h-16 w-16 rounded-full bg-green-100 ring-2 ring-green-200 flex items-center justify-center text-green-700 text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div>
            <button className="text-sm text-green-600 font-medium hover:underline">
              Change photo
            </button>
            <p className="text-xs text-gray-400 mt-0.5">JPG or PNG, max 2 MB</p>
          </div>
        </div>

        <div className="md:w-80 space-y-3">
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Display name
            </Label>
            <Input
              className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Email
            </Label>
            <Input
              className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
          <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition cursor-pointer">
            <Shield className="text-gray-400" size={15} strokeWidth={1.5} />
            Change password
          </button>
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
