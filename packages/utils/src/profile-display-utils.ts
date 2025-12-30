import type { MediaKit, Profile, ProfileOverrideData } from "@repo/db";

interface GetKitUrlProps {
  kit: MediaKit;
  profile: Profile;
  includeBase?: boolean;
}

export const getDisplayUsername = (profile: Profile, profileOverride: ProfileOverrideData) => {
  return profileOverride.displayName || profile.username;
};

export const getDisplayAvatarUrl = (profile: Profile, profileOverride: ProfileOverrideData) => {
  return profileOverride.customAvatarUrl || profile.avatarUrl;
};

export const getKitUrl = ({ kit, profile, includeBase = true }: GetKitUrlProps) => {
  const baseUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://kyt.one";

  const isDefault = kit.default;
  const url = isDefault ? profile.username : `${profile.username}/${kit.slug}`;

  return includeBase ? `${baseUrl}/${url}` : url;
};
