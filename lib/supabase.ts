import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/** Browser-safe client (uses anon key). */
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

/** Server-only client (uses service role key — never expose to the client). */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
