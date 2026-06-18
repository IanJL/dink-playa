const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

export default function Courts({ courtBlocks, accent, hostView, onRemove }) {
  return (
    <>
      {courtBlocks.map((court, ci) => (
        <div key={ci} style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
            <span style={{ display: 'inline-block', width: 13, height: 13, borderRadius: 4, border: '2px solid #1a1a1a', background: court.color }} />
            <span style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 17, textTransform: 'uppercase', letterSpacing: '-.3px' }}>
              Court {court.num}
            </span>
            <span style={{ flex: 1, height: 2, background: '#1a1a1a', opacity: 0.15 }} />
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.55 }}>{court.label}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {court.slots.map((slot, si) =>
              slot.filled ? (
                <div
                  key={si}
                  style={{
                    position: 'relative',
                    background: '#fff',
                    border: '2px solid #1a1a1a',
                    borderRadius: 14,
                    padding: '11px 8px 9px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      border: '2px solid #1a1a1a',
                      background: slot.bg,
                      color: slot.fg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: BRICOLAGE,
                      fontWeight: 800,
                      fontSize: 16,
                      animation: 'dcPop .3s ease',
                    }}
                  >
                    {slot.initials}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {slot.name}
                  </div>
                  {slot.hasBring && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', maxWidth: '100%' }}>
                      {slot.brings.map((bp, bi) => (
                        <span
                          key={bi}
                          style={{
                            fontSize: 9.5,
                            fontWeight: 800,
                            letterSpacing: '.3px',
                            textTransform: 'uppercase',
                            background: accent,
                            color: '#fff',
                            border: '1.5px solid #1a1a1a',
                            borderRadius: 999,
                            padding: '1px 8px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {bp}
                        </span>
                      ))}
                    </div>
                  )}
                  {(slot.ownedByMe || hostView) && (
                    <button
                      onClick={() => onRemove(slot.id)}
                      style={{
                        position: 'absolute',
                        top: -7,
                        right: -7,
                        width: 21,
                        height: 21,
                        borderRadius: 999,
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '2px solid #efe6d4',
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: 'pointer',
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div
                  key={si}
                  style={{
                    border: '2px dashed #c2b698',
                    borderRadius: 14,
                    padding: '11px 8px 9px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    color: '#9a8e72',
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 999, border: '2px dashed #c2b698', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    +
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>Open</div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </>
  )
}
