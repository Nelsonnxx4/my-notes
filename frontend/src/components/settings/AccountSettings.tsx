import { Input } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { getUserDisplayName } from "@/utils/userProfile";

const inputClasses = {
  inputWrapper:
    "outline-none px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-300 transition dark:border-gray-800 dark:bg-gray-900 dark:focus-within:ring-gray-700",
  input: "text-sm outline-none dark:text-gray-100",
};

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = getUserDisplayName(user);

  function handleSignOut() {
    logout();
    navigate("/auth/login", { replace: true });
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-4 dark:text-gray-100">
          Profile
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <UserAvatar size="lg" user={user} />
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-400 border-2 border-white" />
          </div>
        </div>

        <div className="space-y-3">
          <Input
            classNames={inputClasses}
            isReadOnly
            placeholder="Display name"
            type="text"
            value={displayName}
          />
          <Input
            classNames={inputClasses}
            description="Your sign-in email cannot be changed here."
            isReadOnly
            placeholder="Email"
            type="email"
            value={user?.email ?? ""}
          />
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3 dark:text-gray-100">
          Account
        </h3>
        <div className="space-y-1">
          <button
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition cursor-pointer dark:hover:bg-red-950/30"
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
