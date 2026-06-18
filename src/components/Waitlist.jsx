const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

export default function Waitlist({ rows, count, hint, accent, hostView, onRemove }) {
  if (!rows.length) return null
  return (
    <div
      style={{
        marginTop: 24,
        background: '#fbf3e2',
        border: '2.5px solid #1a1a1a',
        borderRadius: 18,
        padding: 16,
        boxShadow: `4px 4px 0 ${accent}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 16, textTransform: 'uppercase', letterSpacing: '-.3px' }}>
          Waitlist
        </span>
        <span style={{ background: accent, color: '#fff', border: '2px solid #1a1a1a', borderRadius: 999, fontSize: 12, fontWeight: 800, padding: '1px 9px' }}>
          {count}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rows.map((w) => (
          <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 14, width: 20, opacity: 0.5 }}>{w.pos}</span>
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: '2px solid #1a1a1a',
                background: w.bg,
                color: w.fg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: BRICOLAGE,
                fontWeight: 800,
                fontSize: 13,
                flex: 'none',
              }}
            >
              {w.initials}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {w.name}
            </span>
            {w.hasBring && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, flex: 'none', justifyContent: 'flex-end', maxWidth: 140 }}>
                {w.brings.map((wb, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      letterSpacing: '.3px',
                      textTransform: 'uppercase',
                      background: '#ece3cf',
                      border: '1.5px solid #1a1a1a',
                      borderRadius: 999,
                      padding: '1px 8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {wb}
                  </span>
                ))}
              </div>
            )}
            {w.isNext && (
              <span style={{ background: '#1a1a1a', color: '#efe6d4', fontSize: 9, fontWeight: 800, letterSpacing: '.6px', padding: '3px 7px', borderRadius: 999, flex: 'none' }}>
                NEXT UP
              </span>
            )}
            {(w.ownedByMe || hostView) && (
              <button
                onClick={() => onRemove(w.id)}
                style={{ background: 'transparent', border: 'none', color: '#1a1a1a', opacity: 0.4, fontWeight: 800, fontSize: 16, cursor: 'pointer', flex: 'none' }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {hint && <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.6, marginTop: 12, lineHeight: 1.4 }}>{hint}</div>}
    </div>
  )
}
