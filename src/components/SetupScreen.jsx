import Seal from './Seal.jsx'

const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

// Shown when Supabase isn't configured or the database isn't reachable yet.
export default function SetupScreen({ reason }) {
  const code = {
    fontFamily: 'ui-monospace, Menlo, monospace',
    background: '#1a1a1a',
    color: '#efe6d4',
    padding: '2px 6px',
    borderRadius: 6,
    fontSize: 13,
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <Seal accent="#c2602e" />
          <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 34, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-1.5px' }}>
            Dink Playa
          </div>
        </div>

        <div style={{ background: '#fff', border: '2.5px solid #1a1a1a', borderRadius: 18, padding: 20, boxShadow: '5px 5px 0 #1a1a1a' }}>
          <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 20, marginBottom: 10 }}>Almost there — connect the database</div>
          <p style={{ fontSize: 15, lineHeight: 1.5, marginTop: 0 }}>
            {reason === 'config'
              ? 'The app can’t find your Supabase keys.'
              : 'The app loaded but couldn’t reach your database tables yet.'}
          </p>
          <ol style={{ fontSize: 15, lineHeight: 1.6, paddingLeft: 20 }}>
            <li>
              Copy <span style={code}>.env.example</span> to <span style={code}>.env</span> and paste in your
              <span style={code}>VITE_SUPABASE_URL</span> and <span style={code}>VITE_SUPABASE_ANON_KEY</span>.
            </li>
            <li>
              In Supabase, open the SQL Editor and run <span style={code}>supabase_schema.sql</span>.
            </li>
            <li>Restart the dev server (or redeploy) so the new values load.</li>
          </ol>
          <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 0 }}>
            Full walkthrough is in <span style={code}>SETUP_GUIDE.md</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
