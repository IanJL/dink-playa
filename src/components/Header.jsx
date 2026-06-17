import Seal from './Seal.jsx'

const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

export default function Header({ clubName, accent, bandColors, hostView, onToggleHost }) {
  const hostBtnStyle = {
    flex: 'none',
    cursor: 'pointer',
    fontFamily: "'Hanken Grotesk'",
    fontWeight: 700,
    fontSize: 13,
    border: '2px solid #1a1a1a',
    borderRadius: 999,
    padding: '8px 14px',
    boxShadow: '3px 3px 0 #1a1a1a',
    background: hostView ? '#1a1a1a' : '#fff',
    color: hostView ? '#efe6d4' : '#1a1a1a',
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Seal accent={accent} />
          <div
            style={{
              fontFamily: BRICOLAGE,
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '-1.5px',
              paddingBottom: 2,
            }}
          >
            {clubName}
          </div>
        </div>
        <button onClick={onToggleHost} style={hostBtnStyle}>
          {hostView ? '✓ Host' : '○ Host'}
        </button>
      </div>

      {/* Retro band */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          height: 9,
          borderRadius: 999,
          overflow: 'hidden',
          margin: '16px 0 22px',
          border: '2px solid #1a1a1a',
        }}
      >
        {bandColors.map((bc, i) => (
          <div key={i} style={{ flex: 1, background: bc }} />
        ))}
      </div>
    </>
  )
}
