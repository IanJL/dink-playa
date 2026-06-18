import { useState, useEffect } from 'react'

const BRICOLAGE = "'Bricolage Grotesque',sans-serif"
const HANKEN = "'Hanken Grotesk'"

const inputStyle = {
  fontFamily: HANKEN,
  fontSize: 14,
  fontWeight: 700,
  color: '#1a1a1a',
  background: '#fff',
  border: '2px solid #1a1a1a',
  borderRadius: 10,
  padding: '8px 10px',
  cursor: 'pointer',
}

export default function HostControls({
  sessionFull,
  sessionDayShort,
  selDateISO,
  dateOverridden,
  onDateChange,
  onResetDate,
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  courts,
  maxCourts,
  onCourtDec,
  onCourtInc,
  courtNums,
  onCourtNumChange,
  onReset,
  accent,
}) {
  // Local copy of court labels so typing (e.g. "2/3") stays smooth and isn't
  // interrupted by the database round-trip on each keystroke.
  const [labels, setLabels] = useState(courtNums)
  useEffect(() => {
    setLabels(courtNums)
  }, [courtNums.join('')])

  const editLabel = (idx, value) => {
    setLabels((prev) => {
      const next = prev.slice()
      next[idx] = value
      return next
    })
    onCourtNumChange(idx, value)
  }

  const decDisabled = courts <= 1
  const incDisabled = courts >= maxCourts
  const stepBtn = (disabled, size) => ({
    border: 'none',
    background: 'transparent',
    fontSize: size,
    fontWeight: 800,
    width: 40,
    height: 40,
    lineHeight: 1,
    color: '#1a1a1a',
    opacity: disabled ? 0.25 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  })

  return (
    <>
      <div
        style={{
          background: '#fbf3e2',
          border: '2.5px solid #1a1a1a',
          borderRadius: 18,
          padding: 16,
          marginTop: 12,
          boxShadow: `4px 4px 0 ${accent}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 16, textTransform: 'uppercase', letterSpacing: '-.3px' }}>
            Host controls
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.45 }}>{sessionFull}</span>
          <span style={{ flex: 1, height: 2, background: '#1a1a1a', opacity: 0.12 }} />
        </div>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 13, borderBottom: '2px solid rgba(26,26,26,.1)' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>Date</div>
            {dateOverridden && (
              <button
                onClick={onResetDate}
                style={{ background: 'transparent', border: 'none', padding: '2px 0 0', fontFamily: HANKEN, fontSize: 12, fontWeight: 700, color: '#1a1a1a', opacity: 0.55, cursor: 'pointer', textDecoration: 'underline' }}
              >
                ↺ reset to regular {sessionDayShort}
              </button>
            )}
          </div>
          <input type="date" value={selDateISO} onChange={onDateChange} style={inputStyle} />
        </div>

        {/* Time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 0', borderBottom: '2px solid rgba(26,26,26,.1)' }}>
          <div style={{ fontSize: 13.5, fontWeight: 800 }}>Time</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <input type="time" value={startTime} onChange={onStartChange} style={{ ...inputStyle, padding: '8px 9px' }} />
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.5 }}>to</span>
            <input type="time" value={endTime} onChange={onEndChange} style={{ ...inputStyle, padding: '8px 9px' }} />
          </div>
        </div>

        {/* Courts open stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 13 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>Courts open</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.45, marginTop: 2 }}>How many courts are booked tonight</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '2px solid #1a1a1a', borderRadius: 999, overflow: 'hidden', background: '#fff' }}>
            <button onClick={onCourtDec} disabled={decDisabled} style={stepBtn(decDisabled, 20)}>−</button>
            <span style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 18, width: 34, textAlign: 'center' }}>{courts}</span>
            <button onClick={onCourtInc} disabled={incDisabled} style={stepBtn(incDisabled, 18)}>＋</button>
          </div>
        </div>

        {/* Court numbers */}
        <div style={{ paddingTop: 14, marginTop: 14, borderTop: '2px solid rgba(26,26,26,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 9 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>Court numbers</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.45 }}>the park's physical courts</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {labels.map((n, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '2px solid #1a1a1a', borderRadius: 12, padding: '6px 6px 6px 11px' }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.5px', textTransform: 'uppercase', opacity: 0.5 }}>Court</span>
                <input
                  type="text"
                  value={n}
                  onChange={(e) => editLabel(idx, e.target.value)}
                  placeholder="2/3"
                  style={{ width: 64, fontFamily: BRICOLAGE, fontSize: 18, fontWeight: 800, color: '#1a1a1a', background: '#ece3cf', border: 'none', borderRadius: 8, padding: '6px 6px', textAlign: 'center' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset bar */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={onReset}
          style={{ flex: 1, background: 'transparent', border: '2px solid #1a1a1a', borderRadius: 999, padding: 9, fontFamily: HANKEN, fontWeight: 700, fontSize: 13, cursor: 'pointer', color: '#1a1a1a' }}
        >
          ↺ Reset this session
        </button>
      </div>
    </>
  )
}
