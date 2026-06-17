# Dink Playa — Setup Guide (no-code friendly)

This walks you from the files on your computer to a live link your club can open
on their phones. It's mostly clicking and pasting. Allow ~30 minutes the first time.

There are three parts:

- **Part A — Database (Supabase):** the shared brain that lets every phone see the
  same roster and chat. Browser only.
- **Part B — Put the code online (GitHub + Vercel):** turns the code into a real
  `https://` link. Mostly browser, with one free desktop app for the GitHub step.
- **Part C — Use it:** open the link, add to home screen, share with the club.

You do **Part A first**, then Part B. Keep the two values from Part A handy — you'll
paste them in Part B.

---

## Part A — Set up the database (Supabase)

1. Go to **supabase.com** and sign up (free). Click **New project**.
   - Give it a name (e.g. `dink-playa`), set a database password (save it
     somewhere — you won't need it for this app, but Supabase requires one),
     pick a region near you, and create the project. Wait ~2 minutes for it to
     finish setting up.

2. In the left sidebar, open **SQL Editor** → **New query**.
   - Open the file **`supabase_schema.sql`** (included in this project) in any text
     editor, copy *everything*, paste it into the query box, and click **Run**.
   - You should see "Success. No rows returned." That created the tables, seeded
     your Tuesday/Friday/Sunday sessions, and turned on live updates.

3. Get your two connection values. In the left sidebar, open **Project Settings**
   (the gear) → **Data API**.
   - **Project URL** — copy it. Looks like `https://abcd1234.supabase.co`.
   - Then go to **Project Settings → API Keys** and copy the **anon / public**
     key (a long string). This key is safe to use in a website.
   - Paste both into a temporary note. You'll need them in Part B.

> Why this is safe without logins: the app has no passwords — people just type
> their name. The database rules are intentionally open so anyone with your link
> can sign up and chat. That's fine for a small, trusted club. (If you ever want
> real logins later, the schema file has notes on tightening it.)

---

## Part B — Put the code online (GitHub + Vercel, both free)

We'll host on **Vercel**, which builds and serves the app and lets you paste in
your Supabase values. Vercel pulls the code from **GitHub**, so we put it there
first using a free desktop app (no command line needed).

### B1. Get the code onto GitHub
1. Create a free account at **github.com**.
2. Download and install **GitHub Desktop** (desktop.github.com) — a clicky app, no
   terminal.
3. In GitHub Desktop: **File → Add local repository** → choose this `dink-playa`
   folder. If it says it's not a repository, click **"create a repository"** —
   accept the defaults and **Create repository**.
4. Click **Publish repository** (top bar). Uncheck "Keep this code private" only if
   you don't mind it being public; either is fine. Click **Publish**.
   - The included `.gitignore` already keeps the big `node_modules` folder out.

### B2. Deploy on Vercel
1. Go to **vercel.com** and **Sign up with GitHub** (one click).
2. Click **Add New… → Project**, find your `dink-playa` repo, click **Import**.
3. Vercel auto-detects it's a Vite app — leave the build settings as-is.
4. Expand **Environment Variables** and add these **two** (use the values from
   Part A, step 3):

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | your Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your anon/public key |

5. Click **Deploy**. After ~1 minute you'll get a live link like
   `https://dink-playa.vercel.app`. Open it — you should see the app with the
   Tue/Fri/Sun cards. 🎾

> If you instead see the "connect the database" screen, the two environment
> variables are missing or misspelled. In Vercel: **Settings → Environment
> Variables**, fix them, then **Deployments → … → Redeploy**.

---

## Part C — Use it & install on phones

- **Share** the Vercel link with your club (text, WhatsApp, etc.).
- **Install on iPhone:** open the link in Safari → tap the Share button → **Add to
  Home Screen**. It now opens like an app, full-screen, with the Dink Playa icon.
- **Install on Android:** open in Chrome → menu (⋮) → **Add to Home screen / Install
  app**.
- **Host controls:** tap the **○ Host** button (top right) to edit the date, time,
  how many courts are open, and court numbers, or to reset a session. Anyone can
  toggle host for now (no logins) — see the note below.

---

## Common questions

**Do people need to download anything?**
No. They open your link. "Add to Home Screen" is optional and makes it feel like a
real app.

**Two phones aren't seeing the same roster.**
That means the database isn't connected. Re-check Part A (did the SQL run?) and the
two environment variables in Vercel (Part B4).

**Anyone can press "Host" — is that a problem?**
With no logins, yes, host mode is open to everyone. Fine for a trusted group. When
you want to lock it down, that's the point to add real sign-in (see `README.md` and
the notes in `supabase_schema.sql`).

**Can this become a real iPhone/Android app in the stores later?**
Yes — it's built to. See `CAPACITOR.md`.

**I just want to test it on my own computer first.**
See "Run locally" in `README.md`.
