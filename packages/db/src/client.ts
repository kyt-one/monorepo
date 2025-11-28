import { createClient } from "@supabase/supabase-js";

const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = String(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey);
