import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <div className="ad-page">
        <div className="ad-card ad-login-card">
          <h1>Configuration error</h1>
          <p className="ad-muted">
            Supabase env vars are missing. Set VITE_SUPABASE_URL and
            VITE_SUPABASE_ANON_KEY in your .env file, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (checkingSession) {
    return (
      <div className="ad-page">
        <div className="ad-muted">Loading…</div>
      </div>
    );
  }

  return session ? <Dashboard session={session} /> : <Login />;
}

/* -------------------------------------------------------------------------- */
/* Login                                                                      */
/* -------------------------------------------------------------------------- */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) setError(signInError.message);
    setBusy(false);
  };

  return (
    <div className="ad-page">
      <div className="ad-card ad-login-card">
        <div className="ad-header">
          <h1>
            ADMIN <span>LOGIN</span>
          </h1>
          <div className="ad-divider" />
        </div>

        <form className="ad-form" onSubmit={handleSubmit}>
          <div className="ad-field">
            <label htmlFor="ad-email">Email</label>
            <input
              id="ad-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="ad-field">
            <label htmlFor="ad-password">Password</label>
            <input
              id="ad-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="ad-error">{error}</div>}

          <button type="submit" className="ad-btn" disabled={busy}>
            {busy ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>

        <p className="ad-muted ad-note">
          Access is restricted to accounts listed in the <code>admins</code> table.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

function Dashboard({ session }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    // RLS decides what comes back: a non-admin gets an empty set, not an error.
    const { data, error: selectError } = await supabase
      .from("event_registrations")
      .select("id, name, email, phone, admission_number, created_at")
      .order("created_at", { ascending: false });

    if (selectError) setError(selectError.message);
    else setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.admission_number]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Admission Number", "Registered At"];
    // Escape quotes so values containing commas/quotes survive the round trip.
    const escape = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
    const lines = [
      header.map(escape).join(","),
      ...filtered.map((r) =>
        [r.name, r.email, r.phone, r.admission_number, r.created_at].map(escape).join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tedxtiet-registrations-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ad-page ad-page--wide">
      <div className="ad-card ad-dash-card">
        <div className="ad-topbar">
          <div>
            <h1 className="ad-title">
              REGISTRATIONS <span>DASHBOARD</span>
            </h1>
            <p className="ad-muted ad-signed-in">Signed in as {session.user.email}</p>
          </div>
          <button className="ad-btn ad-btn--ghost" onClick={() => supabase.auth.signOut()}>
            SIGN OUT
          </button>
        </div>

        <div className="ad-stats">
          <Stat label="Total" value={rows.length} />
          <Stat label="Showing" value={filtered.length} />
        </div>

        <div className="ad-toolbar">
          <input
            className="ad-search"
            type="search"
            placeholder="Search name, email, phone, admission no…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="ad-btn ad-btn--ghost" onClick={load} disabled={loading}>
            {loading ? "REFRESHING…" : "REFRESH"}
          </button>
          <button className="ad-btn" onClick={exportCsv} disabled={!filtered.length}>
            EXPORT CSV
          </button>
        </div>

        {error && <div className="ad-error">{error}</div>}

        {loading ? (
          <div className="ad-muted ad-empty">Loading registrations…</div>
        ) : !rows.length ? (
          <div className="ad-muted ad-empty">
            No registrations visible. If you expect data here, make sure your account is in the{" "}
            <code>admins</code> table — RLS returns an empty set for non-admins.
          </div>
        ) : !filtered.length ? (
          <div className="ad-muted ad-empty">No rows match your search.</div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Admission No.</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id}>
                    <td className="ad-dim">{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{r.admission_number}</td>
                    <td className="ad-dim">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-value">{value}</div>
      <div className="ad-stat-label">{label}</div>
    </div>
  );
}
