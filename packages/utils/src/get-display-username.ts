import type { Profile, ProfileOverrideData } from "@repo/db";

export const getDisplayUsername = (profile: Profile, profileOverride: ProfileOverrideData) => {
  return profileOverride.displayName || profile.username;
};
