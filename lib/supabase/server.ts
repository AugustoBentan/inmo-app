import { createClient } from "@supabase/supabase-js";

// Cliente para el SERVIDOR (usa service role, bypasea RLS — solo en API routes)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
