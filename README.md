# Dink Playa 🎾

A mobile-first **pickleball signup & court booking** app for a recurring club.
Members see the week's sessions (Tue / Fri / Sun), sign up, get auto-seated to a
court or placed on a waitlist, declare what gear they're bringing, and chat per
session. A host can edit date/time, open/close courts, and renumber courts.

This is the **real, multi-user version** of the design prototype: every phone sees
the same roster and chat live, backed by Supabase.

- **Stack:** React + Vite, Supabase (Postgres + Realtime), installable PWA.
- **Cross-platform:** runs as a website on any phone/desktop, installs to the home
  screen, and is ready to wrap as a native iOS/Android app later via Capacitor
  (see `CAPACITOR.md`) — same codebase, no rewrite.
- **Sign-in:** none. People just type a name (stored on their device). Simple for a
  trusted club; see "Security" below to harden later.

## Get it running

**Most people should follow [`SETUP_GUIDE.md`](./SETUP_GUIDE.md)** — a step-by-step,
click-and-paste walkthrough (Supabase → GitHub → Vercel) that ends with a live link.

### Run locally (to test on your own computer)
You need [Node.js](https://nodejs.org) (LTS) installed.

```bash
npm install
cp .env.example .env       # then paste your Supabase URL + anon key into .env
npm run dev                # opens http://localhost:5173
```

Build a production bundle with `npm run build` (output in `dist/`).

## Configuration

- **Supabase keys:** `.env` → `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- **Club name / venue / gear list:** `src/lib/config.js`.
- **Color palette:** `src/lib/palettes.js` — switch `ACTIVE_PALETTE` to
  `Sunset` (default), `Court`, or `Mono`.
- **Sessions, court counts, spots per court:** stored in the `sessions` table; edit
  defaults in `supabase_schema.sql` or live via the in-app Host controls.

## How it works (architecture)

The prototype's seating logic is kept on the **client** — the database only stores
raw facts and court/waitlist placement is *derived* every render:

- `sessions` — the 3 recurring weekday slots (day, regular time, court numbers,
  spots-per-court, max courts). A host's date/time change is a **one-off** for the
  next occurrence: it's stored in `override_*` columns and auto-expires once that
  date passes, so the session rolls forward to the next weekday at the regular time
  automatically. (Sessions with no override always show the next weekday.)
- `signups` — one row per person per game occurrence. **`created_at` order = seat
  order.** The first `courts × spots` people are confirmed (seated by index); the
  rest are the waitlist. Dropping out = delete the row → everyone re-derives, so the
  next person is auto-promoted. No server logic.
- `messages` — per-session group chat.

Realtime subscriptions on all three tables push changes to every connected phone.

Key files:

```
src/
  App.jsx                 orchestrates state, data, and all handlers
  supabaseClient.js       Supabase connection (reads .env)
  lib/
    config.js             club name, venue, gear, month/day names
    palettes.js           the 3 color palettes
    helpers.js            dates, time formatting, initials, colors
    seating.js            derive courts + waitlist from signups
  hooks/
    useIdentity.js        per-device id + display name (no login)
    useSessions.js        load + live-subscribe sessions
    useSignups.js         load + live-subscribe signups
    useMessages.js        load + live-subscribe chat
  components/             one file per UI section (faithful to the design)
```

## Security (read before going beyond a trusted group)

With no logins, the database rules are **permissive**: anyone with the link can
sign up, drop anyone, post chat, and toggle Host. That's intentional for a small
private club. To harden:

1. Add Supabase auth (email magic link is the easiest — free, no SMS).
2. Replace the per-device id with the real user id.
3. Swap the permissive RLS policies for owner-scoped ones (examples are in
   `supabase_schema.sql`), and gate Host edits behind an admin check.

## Files in this project

- `SETUP_GUIDE.md` — the click-and-paste deploy walkthrough. **Start here.**
- `supabase_schema.sql` — paste into Supabase to create everything.
- `CAPACITOR.md` — how to ship native iOS/Android apps later from this same code.
- `.env.example` — template for your Supabase keys.

---

*Design and behavioral spec from the original handoff (Bricolage Grotesque +
Hanken Grotesk, hard 2px borders, offset shadows, the Sunset palette). The look is
the brand — kept intact.*
