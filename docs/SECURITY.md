# ClientOS threat model (read this before trusting it)

Everything below runs client-side in the browser. There is no server.

## What this protects you from

- **A curious person at an unlocked machine poking at the UI**: they hit the
  login screen, guesses are throttled (5 fails → 30s, doubling to a 15-minute
  cap), and roles hide what they shouldn't see.
- **Password disclosure**: passwords are stored only as salted PBKDF2-SHA256
  hashes (600,000 iterations, 16-byte salt, per-record parameters). Someone
  reading localStorage does not learn the actual password your agent probably
  reuses elsewhere. This is the single genuinely cryptographic guarantee in
  the whole system.
- **Honest-user mistakes**: an agent can't accidentally edit another agent's
  clients or wander into operator screens — reads go through one authorization
  choke point (`selectVisibleClients`) and the reducer rejects operator-only
  actions from agents.

## What it does NOT protect you from

- **Anyone who opens DevTools on the device.** They can read every client and
  commission, edit localStorage, grant themselves operator, clear the lockout,
  or forge a session. All enforcement runs in JavaScript they control.
  Client-side auth on a static host is a **lock on a glass door**.
- **No shared database.** Each browser profile has its own copy of everything.
  Agents logging in on their own machines see their own empty world — their
  secured clients do NOT appear on yours. Until the backend exists, ClientOS is
  truthfully a single-device HQ where you record what agents report, or a
  same-device multi-login setup. Do not promise agents live sync.
- **XSS owns everything.** The app is dependency-light and renders no
  user-supplied HTML — keep it that way. No third-party scripts, ever.

## Session + throttle details

- Sessions: 12h hard expiry (30 days with "Remember me"), killed across tabs
  via the `storage` event, invalidated instantly when an account is benched.
- Login is uniform: unknown usernames burn a dummy PBKDF2 derive so timing and
  UX never confirm which usernames exist.

## Upgrade path (~1 day of work, do it when Stripe money arrives)

1. **Supabase** (you need a database for clients/commissions anyway, not just
   auth): enable email+password auth; create `profiles(role)`, `clients`,
   `quotas`, `events` tables mirroring the doc shape in `engine/initialState.js`.
2. Turn on **Row Level Security** — the policies are literally
   `engine/permissions.js` translated to SQL (`clients.viewOwn` →
   `agent_id = auth.uid()`; `clients.viewAll` → `role = 'operator'`).
3. Swap the internals of `lib/authCrypto.js` / `lib/session.js` / `hooks/useAuth.js`
   for supabase-js calls behind the same exported signatures — components don't
   change. That's why these module boundaries exist.
4. One-time migration: read `clientos.v1.doc` from the operator's browser and
   insert via the service role. Agents get real invite emails.
5. From that day: real multi-device sync, real enforcement, Stripe webhooks
   land server-side. The free tier covers a 3-person team indefinitely.
