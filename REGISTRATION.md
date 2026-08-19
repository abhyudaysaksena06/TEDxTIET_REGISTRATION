# Registration page + admin dashboard

Two routes were added to the existing site. **Neither is linked from the navbar
or anywhere else** — they're reachable only by typing the URL directly.

| Route           | What it is                                        |
| --------------- | ------------------------------------------------- |
| `/register-now` | Public registration form                          |
| `/admin`        | Admin dashboard — Supabase login, RLS-gated table |

## Why `/register-now` and not `/register`

The repo already had a `/register` route (`src/Components/Register.jsx`) using a
different form (roll no. / year of study) and a different table. That one is left
completely untouched. The new page lives at `/register-now` and writes to its own
`event_registrations` table, so the two can't collide.

If you'd rather this replace the old one, point `/register` at `<RegisterNow />`
in `src/App.js` and delete the old component — but check with whoever built it first.

## Files added

```
src/Components/RegisterNow.jsx        public form
src/Components/RegisterNow.css        styles, all scoped under .rn-
src/Components/AdminDashboard.jsx     login + data table + CSV export
src/Components/AdminDashboard.css     styles, all scoped under .ad-
src/lib/supabaseClient.js             shared client
supabase/schema.sql                   tables, RLS policies, admin allow-list
supabase/functions/event-register/    Edge Function that handles inserts
.env.example                          env var template
```

All CSS is scoped under `.rn-` / `.ad-` prefixes. The standalone app set global
`body` and `*` styles; those were dropped so nothing leaks into the rest of the site.

## Setup

### 1. Environment variables

```bash
cp .env.example .env
```

Fill in your project URL and anon key from **Project Settings → API**. Vite only
exposes vars prefixed with `VITE_`. `.env` is gitignored — don't commit real keys.

Restart the dev server after editing `.env`; Vite only reads it at startup.

### 2. Database

Run the whole of [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL
editor. It creates:

- `event_registrations` — the data, RLS enabled, **no public insert policy**
- `admins` — the allow-list of user IDs permitted to read registrations
- `public.is_admin()` — `SECURITY DEFINER` helper used by the policies

### 3. Edge Function

```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy event-register
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically — no
manual secret setup needed.

### 4. Create an admin

Creating the user and granting admin are two separate steps.

1. **Supabase dashboard → Authentication → Users → Add user.** Set an email and
   password.
2. Then in the SQL editor:

   ```sql
   insert into admins (user_id, email)
   select id, email from auth.users where email = 'you@thapar.edu'
   on conflict (user_id) do nothing;
   ```

To revoke: `delete from admins where email = 'them@thapar.edu';`

### 5. Run

```bash
npm start
```

Then visit `/register-now` and `/admin`.

## How the access control works

The dashboard is **not** protected by the route being unlisted — an unlisted URL
is not security. The actual enforcement is Row Level Security in Postgres:

```sql
create policy "Admins can read registrations"
  on event_registrations for select to authenticated
  using (public.is_admin());
```

`is_admin()` checks whether the caller's `auth.uid()` has a row in `admins`. So:

- A signed-out visitor hitting `/admin` sees the login screen.
- A signed-in user who isn't in `admins` sees an **empty table**, not an error —
  that's RLS filtering rows, which is the expected behaviour.
- Even someone calling the REST API directly with the anon key gets nothing back.

`is_admin()` is `SECURITY DEFINER` so its own lookup on `admins` isn't subject to
RLS — without that, the policy would recurse into itself.

The anon key is public by design (it ships in the JS bundle). It's safe *because*
RLS is on. Never put the service role key in frontend code — it bypasses RLS
entirely. It's only used inside the Edge Function, where Supabase injects it.

## Abuse protection on the public form

Writes go through the Edge Function rather than a direct client insert, so the
checks can't be bypassed by editing frontend code:

- **Per-IP rate limit** — 3 registrations per IP per 60 minutes, using the real
  request IP from `x-forwarded-for`, not a client-supplied value.
- **Honeypot** — a hidden `website` field real users never fill. Bots that fill
  it get a fake success response so they don't learn they were rejected.
- **Unique email** — enforced by a DB-level unique index.
- **No public insert policy** — RLS blocks direct table writes outright.

Tune `MAX_REQUESTS_PER_IP` / `WINDOW_MINUTES` in the Edge Function.

**Limitation:** IP rate limiting only slows abuse from a single network. It can't
stop someone cycling through VPNs or proxies. No server-side check closes that gap
alone; the standard fix is a CAPTCHA (e.g. Cloudflare Turnstile, free), which was
intentionally left out. Add it if distributed abuse becomes a real problem.

## Notes

- `vercel.json` already rewrites all paths to `index.html`, so both routes work on
  a hard refresh in production.
- The site navbar renders on both new pages since it's mounted globally in
  `App.js`. If you want the admin page bare, wrap the navbar in a path check there.
