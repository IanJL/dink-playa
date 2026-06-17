import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helpful error if the .env values are missing.
export const isConfigured = Boolean(url && anonKey)

if (!isConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase is not configured. Copy .env.example to .env and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

// We pass placeholder strings when not configured so the import doesn't crash;
// the App shows a friendly setup screen instead.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key'
)
