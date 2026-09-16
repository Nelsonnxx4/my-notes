import { useEffect, useState } from "react";

import {
  getUserDisplayName,
  getUserInitial,
  type UserProfile,
} from "@/utils/userProfile";

interface UserAvatarProps {
  user?: UserProfile | null;
  size?: "sm" | "lg";
}

const avatarSizes = {
  sm: "h-11 w-11 text-base",
  lg: "h-16 w-16 text-xl",
};

const baseClasses =
  "rounded-full ring-2 ring-green-200 bg-green-100 text-green-700 font-bold select-none overflow-hidden";

const UserAvatar = ({ user, size = "sm" }: UserAvatarProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const avatarUrl = user?.avatarUrl?.trim();
  const displayName = getUserDisplayName(user);
  const sizeClass = avatarSizes[size];

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  if (avatarUrl && !imageFailed) {
    return (
      <img
        alt={`${displayName} profile`}
        className={`${sizeClass} ${baseClasses} object-cover`}
        referrerPolicy="no-referrer"
        src={avatarUrl}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className={`${sizeClass} ${baseClasses} flex items-center justify-center`}>
      {getUserInitial(user)}
    </div>
  );
};

export default UserAvatar;
