import { createClient } from '@supabase/supabase-js';

let supabaseServer = null;

export function getSupabaseServer() {
  // create client lazily so this module can be imported in mixed contexts
  if (supabaseServer) return supabaseServer;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // helpful error for server logs (do not expose secret values)
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  return supabaseServer;
}