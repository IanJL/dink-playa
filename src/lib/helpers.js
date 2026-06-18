// Pure helpers ported from the prototype's logic class.

// --- Avatars / color ---
export function initials(n) {
  const p = String(n || '').trim().split(/\s+/)
  return (((p[0] || '')[0] || '') + ((p[1] || '')[0] || '')).toUpperCase() || '?'
}

export function luminance(hex) {
  const h = String(hex).replace('#', '')
  const r = parseInt(h.substr(0, 2), 16)
  const g = parseInt(h.substr(2, 2), 16)
  const b = parseInt(h.substr(4, 2), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export function fgFor(bg) {
  return luminance(bg) > 150 ? '#1a1a1a' : '#fff'
}

// Stable color for a name (used for chat avatars).
export function colorForName(name, colors) {
  const sum = String(name).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return colors[sum % colors.length]
}

// --- Dates ---
export function daysUntil(dow) {
  const t = new Date().getDay()
  return (dow - t + 7) % 7
}

export function nextDate(dow) {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  d.setDate(d.getDate() + daysUntil(dow))
  return d
}

export function parseISO(s) {
  const p = String(s).split('-').map(Number)
  return new Date(p[0], p[1] - 1, p[2])
}

export function toISO(d) {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

export function startOfToday() {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

// A host's one-off override only counts while its date is today or later.
// Once that session has happened, the override is ignored and the session
// rolls forward to the next weekday automatically.
export function isOverrideActive(session) {
  if (!session || !session.override_date) return false
  return parseISO(session.override_date).getTime() >= startOfToday().getTime()
}

// The date a session occurs: an active one-off override, else the next weekday.
export function sessionDate(session) {
  if (isOverrideActive(session)) return parseISO(session.override_date)
  return nextDate(session.day_of_week)
}

// The session's start/end times: active one-off override times if present,
// otherwise the regular recurring times.
export function sessionTimes(session) {
  if (isOverrideActive(session)) {
    return {
      start: trimTime(session.override_start_time || session.start_time),
      end: trimTime(session.override_end_time || session.end_time),
    }
  }
  return { start: trimTime(session.start_time), end: trimTime(session.end_time) }
}

// --- Time formatting ("5–7 PM") ---
export function fmtTime(start, end) {
  const f = (str) => {
    const p = String(str).split(':')
    let h = parseInt(p[0], 10)
    const m = parseInt(p[1] || '0', 10)
    const ap = h >= 12 ? 'PM' : 'AM'
    let hh = h % 12
    if (hh === 0) hh = 12
    return { label: m ? hh + ':' + String(m).padStart(2, '0') : '' + hh, ap }
  }
  const a = f(start)
  const b = f(end)
  return a.ap === b.ap
    ? a.label + '–' + b.label + ' ' + b.ap
    : a.label + ' ' + a.ap + '–' + b.label + ' ' + b.ap
}

// time column from DB comes back as "17:00:00" — trim to "17:00" for <input type=time>.
export function trimTime(t) {
  return String(t || '').slice(0, 5)
}

export function fmtMsgTime(ts) {
  const d = new Date(ts)
  let h = d.getHours()
  const m = d.getMinutes()
  const ap = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ap
}

// --- Gear pills ("Balls · Franklin" -> "FRANKLIN") ---
export function shortBring(b) {
  if (!b) return ''
  return b.indexOf('Balls') === 0 ? b.split('· ')[1] || 'Balls' : b
}

// --- Courts ---
// Court labels are free text (e.g. "2", "2/3", "A"). When the host opens
// another court we suggest a sensible next label: one more than the highest
// number found among existing labels, else based on the count.
export function nextCourtLabel(labels) {
  const nums = (labels || [])
    .map((l) => parseInt(l, 10))
    .filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : labels.length
  return String(max + 1)
}
