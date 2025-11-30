import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getCurrentUser(client: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}
