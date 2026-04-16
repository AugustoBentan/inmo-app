import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";

// Cliente para el BROWSER (usa anon key, respeta RLS, sesión en cookies)
export function createBrowserClient() {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
