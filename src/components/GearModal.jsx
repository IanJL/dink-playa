import { GEAR } from '../lib/config.js'

const BRICOLAGE = "'Bricolage Grotesque',sans-serif"
const HANKEN = "'Hanken Grotesk'"

export default function GearModal({
  pendingFirst,
  willConfirm,
  selected,
  bandColors,
  accent,
  onToggle,
  onConfirm,
  onSkip,
  onCancel,
}) {
  const title = willConfirm ? `You're in, ${pendingFirst}! 🎾` : `${pendingFirst}, you're on the waitlist`
  const confirmLabel = selected.length
    ? `Add me with ${selected.length} item${selected.length === 1 ? '' : 's'}`
    : 'Add me'

  return (
    <div
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50, padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 448, background: '#efe6d4', border: '2.5px solid #1a1a1a', borderRadius: 22, padding: 20, boxShadow: '6px 6px 0 #1a1a1a', animation: 'dcDrop .26s ease' }}
      >
        <div style={{ display: 'flex', gap: 4, height: 6, borderRadius: 999, overflow: 'hidden', marginBottom: 13, width: 64 }}>
          {bandColors.map((bc, i) => (
            <div key={i} style={{ flex: 1, background: bc }} />
          ))}
        </div>
        <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 23, lineHeight: 1.04, letterSpacing: '-.5px' }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.6, marginTop: 6, marginBottom: 17 }}>Bringing anything? Tap all that apply.</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {GEAR.map((label, i) => {
            const isSel = selected.indexOf(label) >= 0
            return (
              <button
                key={label}
                onClick={() => onToggle(label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  border: '2.5px solid #1a1a1a',
                  borderRadius: 14,
                  padding: '13px 15px',
                  fontFamily: HANKEN,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: isSel ? '#fbf3e2' : '#fff',
                  boxShadow: isSel ? `3px 3px 0 ${accent}` : '3px 3px 0 #1a1a1a',
                }}
              >
                <span style={{ display: 'inline-block', width: 13, height: 13, borderRadius: 4, border: '2px solid #1a1a1a', background: bandColors[i % bandColors.length], flex: 'none' }} />
                <span style={{ flex: 1 }}>{label}</span>
                {isSel && (
                  <span style={{ width: 21, height: 21, borderRadius: 999, background: '#1a1a1a', color: '#efe6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flex: 'none' }}>
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={onConfirm}
          style={{ width: '100%', marginTop: 15, background: '#1a1a1a', color: '#efe6d4', border: 'none', borderRadius: 14, padding: 14, fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onSkip}
          style={{ width: '100%', marginTop: 9, background: 'transparent', border: 'none', fontFamily: HANKEN, fontSize: 13.5, fontWeight: 700, color: '#1a1a1a', opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Just playing — nothing to bring
        </button>
      </div>
    </div>
  )
}
