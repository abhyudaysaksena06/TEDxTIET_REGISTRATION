import { createClient } from "@supabase/supabase-js";

// CRA exposes env vars prefixed with REACT_APP_ (not VITE_).
export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Supabase env vars missing. Copy .env.example to .env and fill in " +
      "REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY."
  );
}

// Single shared client. Used by the admin dashboard for auth + reads.
// The public registration form does NOT use this — it posts to the
// "event-register" Edge Function so abuse checks run server-side.
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
