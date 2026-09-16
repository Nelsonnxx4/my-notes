export interface UserProfile {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export function getUserDisplayName(
  user: UserProfile | null | undefined,
  fallback = "User",
) {
  return user?.name?.trim() || fallback;
}

export function getUserInitial(user: UserProfile | null | undefined) {
  return getUserDisplayName(user).charAt(0).toUpperCase() || "U";
}
