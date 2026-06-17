# Going native later (iOS / Android) with Capacitor

This app is built so the **same codebase** can become real App Store / Google Play
apps with no rewrite. You don't need to do any of this now — ship the web/PWA first.
When you're ready, Capacitor wraps the built site in a native shell.

## Why it already works

- It's a standard Vite single-page app that builds to static files in `dist/`.
- Data is over HTTPS/WebSockets to Supabase, which works the same inside a native
  WebView.
- Identity is stored in `localStorage`, which persists in the native app too.
- No browser-only APIs are required.

## What it costs / requires (when you do it)

- A **Mac with Xcode** to build the iOS app; **Android Studio** for Android.
- **Apple Developer Program** ($99/year) to publish to the App Store.
- **Google Play Developer** account ($25 one-time) for the Play Store.
- App review for each store.

## Steps (for whoever does the native build)

```bash
# 1. Install Capacitor
npm install @capacitor/core
npm install -D @capacitor/cli

# 2. Initialize (appId in reverse-domain form, e.g. com.dinkplaya.app)
npx cap init "Dink Playa" com.dinkplaya.app --web-dir=dist

# 3. Build the web app, then add the platforms you want
npm run build
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# 4. Each time you change the app: rebuild and sync
npm run build && npx cap sync

# 5. Open the native project to run / submit
npx cap open ios       # opens Xcode
npx cap open android   # opens Android Studio
```

## One config note

For the web/PWA deploy, asset paths are served from the site root (the default).
Capacitor serves from a local file origin, so if a screen ever shows up blank in the
native build, set a relative base in `vite.config.js`:

```js
export default defineConfig({
  base: './',   // add this line for Capacitor builds
  // ...rest unchanged
})
```

You can keep two build modes, but the simplest path is to flip `base` to `'./'`
only when building for native and back to `'/'` for the web deploy.

## Nice-to-haves native unlocks

- Real push notifications ("a court opened", "new message") via
  `@capacitor/push-notifications` + Supabase Edge Functions.
- Home-screen presence and app-store discoverability.
- Native share / haptics.

Everything else — the UI, seating logic, chat, host controls — is already done and
shared across web and native.
