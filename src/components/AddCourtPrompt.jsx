const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

export default function AddCourtPrompt({ waitCount, nextCourt, promoteCount, bandColors, accent, onAddCourt }) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        color: '#efe6d4',
        border: '2.5px solid #1a1a1a',
        borderRadius: 18,
        padding: '16px 18px',
        marginTop: 16,
        boxShadow: `5px 5px 0 ${accent}`,
      }}
    >
      <div style={{ display: 'flex', gap: 4, height: 6, borderRadius: 999, overflow: 'hidden', marginBottom: 12, width: 64 }}>
        {bandColors.map((bc, i) => (
          <div key={i} style={{ flex: 1, background: bc }} />
        ))}
      </div>
      <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>{waitCount} on the waitlist</div>
      <div style={{ fontSize: 13, opacity: 0.75, marginTop: 5, marginBottom: 14 }}>
        Open Court {nextCourt} to seat {promoteCount} more player{promoteCount === 1 ? '' : 's'}.
      </div>
      <button
        onClick={onAddCourt}
        style={{ background: '#efe6d4', color: '#1a1a1a', border: 'none', borderRadius: 999, padding: '11px 18px', fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 15, cursor: 'pointer', width: '100%' }}
      >
        ＋ Open Court {nextCourt}
      </button>
    </div>
  )
}
