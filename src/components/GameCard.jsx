const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

export default function GameCard({
  gameWhen,
  location,
  accent,
  courts,
  confirmedCount,
  cap,
  totalSignedUp,
  fillPct,
  bandColors,
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '2.5px solid #1a1a1a',
        borderRadius: 20,
        padding: 20,
        boxShadow: '5px 5px 0 #1a1a1a',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 27, lineHeight: 1, letterSpacing: '-.5px' }}>
            {gameWhen}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 14, fontWeight: 600, opacity: 0.7 }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 999, background: accent }} />
            {location}
          </div>
        </div>
        <div style={{ background: '#1a1a1a', color: '#efe6d4', borderRadius: 12, padding: '8px 11px', textAlign: 'center', flex: 'none' }}>
          <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{courts}</div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.75 }}>
            {courts === 1 ? 'Court' : 'Courts'}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 7,
            whiteSpace: 'nowrap',
            gap: 8,
          }}
        >
          <span>
            {confirmedCount} / {cap} spots filled
          </span>
          <span style={{ opacity: 0.6 }}>{totalSignedUp} signed up</span>
        </div>
        <div style={{ height: 15, background: '#ece3cf', border: '2px solid #1a1a1a', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: fillPct,
              background: `linear-gradient(90deg,${bandColors.join(',')})`,
              transition: 'width .35s ease',
            }}
          />
        </div>
      </div>
    </div>
  )
}
