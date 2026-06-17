import { useRef, useEffect, useState } from 'react'
import { initials, fgFor, colorForName, fmtMsgTime } from '../lib/helpers.js'

const BRICOLAGE = "'Bricolage Grotesque',sans-serif"
const HANKEN = "'Hanken Grotesk'"

export default function ChatModal({
  chatDay,
  messages,
  meName,
  accent,
  bandColors,
  onSend,
  onJoin,
  onClose,
}) {
  const scrollRef = useRef(null)
  const [chatInput, setChatInput] = useState('')
  const [meInput, setMeInput] = useState('')

  // Scroll to the bottom when messages change or the modal opens.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  const send = () => {
    const text = chatInput.trim()
    if (!text) return
    onSend(text)
    setChatInput('')
  }

  const join = () => {
    const n = meInput.trim()
    if (!n) return
    onJoin(n)
    setMeInput('')
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60, padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 448, background: '#fbf3e2', border: '2.5px solid #1a1a1a', borderRadius: 22, overflow: 'hidden', boxShadow: '6px 6px 0 #1a1a1a', animation: 'dcDrop .26s ease', display: 'flex', flexDirection: 'column', maxHeight: '78vh' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px 12px', borderBottom: '2px solid #1a1a1a', flex: 'none' }}>
          <span style={{ fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 17, textTransform: 'uppercase', letterSpacing: '-.3px' }}>Game chat</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.55 }}>{chatDay}</span>
          <span style={{ flex: 1 }} />
          <span style={{ background: '#ece3cf', border: '2px solid #1a1a1a', borderRadius: 999, fontSize: 11.5, fontWeight: 800, padding: '1px 9px' }}>{messages.length}</span>
          <button
            onClick={onClose}
            style={{ flex: 'none', width: 30, height: 30, borderRadius: 999, border: '2px solid #1a1a1a', background: '#fff', color: '#1a1a1a', fontWeight: 800, fontSize: 15, cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ×
          </button>
        </div>

        <div ref={scrollRef} className="dc-scroll" style={{ flex: 1, minHeight: 120, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m) => {
            const mine = meName && m.display_name === meName
            const bg = colorForName(m.display_name, bandColors)
            return (
              <div key={m.id} style={{ display: 'flex', gap: 9, alignItems: 'flex-end', flexDirection: mine ? 'row-reverse' : 'row' }}>
                <div style={{ width: 30, height: 30, flex: 'none', borderRadius: 999, border: '2px solid #1a1a1a', background: bg, color: fgFor(bg), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 12 }}>
                  {initials(m.display_name)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '78%' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.5, margin: '0 4px 3px', textAlign: mine ? 'right' : 'left' }}>
                    {m.display_name} · {fmtMsgTime(m.created_at)}
                  </div>
                  <div
                    style={{
                      maxWidth: '100%',
                      padding: '8px 12px',
                      borderRadius: 15,
                      border: '2px solid #1a1a1a',
                      fontSize: 13.5,
                      fontWeight: 600,
                      lineHeight: 1.35,
                      ...(mine
                        ? { background: accent, color: '#fff', borderBottomRightRadius: 5 }
                        : { background: '#fff', color: '#1a1a1a', borderBottomLeftRadius: 5 }),
                    }}
                  >
                    {m.body}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {meName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', borderTop: '2px solid #1a1a1a', background: '#fff', flex: 'none' }}>
            <div style={{ width: 30, height: 30, flex: 'none', borderRadius: 999, border: '2px solid #1a1a1a', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 12 }}>
              {initials(meName)}
            </div>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              placeholder="Message the group…"
              style={{ flex: 1, minWidth: 0, border: '2px solid #1a1a1a', borderRadius: 999, padding: '9px 14px', fontFamily: HANKEN, fontSize: 14, fontWeight: 600, background: '#fbf3e2', color: '#1a1a1a', outline: 'none' }}
            />
            <button onClick={send} style={{ flex: 'none', background: '#1a1a1a', color: '#efe6d4', border: 'none', borderRadius: 999, width: 40, height: 40, fontSize: 17, fontWeight: 800, cursor: 'pointer', lineHeight: 1 }}>
              ↑
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderTop: '2px solid #1a1a1a', background: '#fff', flex: 'none' }}>
            <input
              value={meInput}
              onChange={(e) => setMeInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') join() }}
              placeholder="Enter your name to join the chat"
              style={{ flex: 1, minWidth: 0, border: '2px solid #1a1a1a', borderRadius: 999, padding: '9px 14px', fontFamily: HANKEN, fontSize: 14, fontWeight: 600, background: '#fbf3e2', color: '#1a1a1a', outline: 'none' }}
            />
            <button onClick={join} style={{ flex: 'none', background: '#1a1a1a', color: '#efe6d4', border: 'none', borderRadius: 999, padding: '9px 18px', fontFamily: BRICOLAGE, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              Join
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
