import { MONTHS, DAY_SHORT } from '../lib/config.js'
import { sessionDate, fmtTime, sessionTimes } from '../lib/helpers.js'

const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

export default function WeekCalendar({
  sessions,
  selectedId,
  accent,
  signedCountFor,
  msgCountFor,
  onSelect,
  onOpenChat,
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
        <span
          style={{
            fontFamily: BRICOLAGE,
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            opacity: 0.55,
          }}
        >
          This week
        </span>
        <span style={{ flex: 1, height: 2, background: '#1a1a1a', opacity: 0.12 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[...sessions]
          .sort((a, b) => sessionDate(a).getTime() - sessionDate(b).getTime())
          .map((s) => {
          const dt = sessionDate(s)
          const times = sessionTimes(s)
          const signed = signedCountFor(s)
          const isSel = s.id === selectedId
          const msgCount = msgCountFor(s.id)

          const cardStyle = {
            cursor: 'pointer',
            textAlign: 'center',
            fontFamily: "'Hanken Grotesk'",
            padding: '13px 6px 14px',
            borderRadius: 16,
            border: '2.5px solid #1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform .12s ease',
            ...(isSel
              ? {
                  background: '#1a1a1a',
                  color: '#efe6d4',
                  boxShadow: `4px 4px 0 ${accent}`,
                  transform: 'translateY(-2px)',
                }
              : { background: '#fff', color: '#1a1a1a', boxShadow: '3px 3px 0 #1a1a1a' }),
          }

          const pillStyle = {
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '.3px',
            padding: '3px 9px',
            borderRadius: 999,
            border: `2px solid ${isSel ? '#efe6d4' : '#1a1a1a'}`,
            ...(isSel
              ? { background: 'transparent', color: '#efe6d4' }
              : signed
                ? { background: accent, color: '#fff' }
                : { background: '#ece3cf', color: '#1a1a1a' }),
          }

          const chatBtnStyle = {
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            cursor: 'pointer',
            borderRadius: 999,
            padding: '3px 8px 3px 7px',
            fontFamily: "'Hanken Grotesk'",
            fontWeight: 800,
            fontSize: 10.5,
            lineHeight: 1,
            border: `2px solid ${isSel ? '#efe6d4' : '#1a1a1a'}`,
            background: isSel ? 'transparent' : '#fff',
            color: isSel ? '#efe6d4' : '#1a1a1a',
          }

          return (
            <div key={s.id} onClick={() => onSelect(s.id)} style={cardStyle}>
              <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {DAY_SHORT[s.day_of_week]}
              </div>
              <div style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 30, lineHeight: 1, margin: '5px 0 1px' }}>
                {dt.getDate()}
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.55, marginBottom: 9 }}>
                {MONTHS[dt.getMonth()]}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>
                {fmtTime(times.start, times.end)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 9 }}>
                <div style={pillStyle}>{signed ? signed + ' in' : 'Open'}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenChat(s.id)
                  }}
                  style={chatBtnStyle}
                  title="Game chat"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
                    <path
                      d="M20 11.5a8 8 0 0 1-8.5 8 9 9 0 0 1-3.5-.7L4 20l1.3-3.7A8 8 0 0 1 4 11.5a8 8 0 0 1 8-8 8 8 0 0 1 8 8z"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {msgCount}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
