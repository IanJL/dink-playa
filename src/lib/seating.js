// Derive courts + waitlist from raw signups, exactly like the prototype.
// `signups` must already be ordered by created_at ascending (= seat order).
import { initials, fgFor, shortBring } from './helpers.js'

export function deriveSeating(signups, session, colors, myUid) {
  const spots = session.spots_per_court
  const courtNums = session.court_nums || [1]
  const courts = courtNums.length
  const cap = courts * spots

  const confirmedCount = Math.min(signups.length, cap)
  const waitlist = signups.slice(cap)

  // Court blocks
  const courtBlocks = []
  for (let c = 0; c < courts; c++) {
    const slots = []
    let filledInCourt = 0
    for (let s = 0; s < spots; s++) {
      const idx = c * spots + s
      const p = signups[idx]
      const filled = p !== undefined
      if (filled) filledInCourt++
      const bg = colors[idx % colors.length]
      slots.push({
        filled,
        empty: !filled,
        id: filled ? p.id : null,
        name: filled ? p.display_name : '',
        initials: filled ? initials(p.display_name) : '',
        brings: filled ? (p.bringing || []).map(shortBring) : [],
        hasBring: filled && (p.bringing || []).length > 0,
        ownedByMe: filled && p.user_id === myUid,
        bg,
        fg: fgFor(bg),
      })
    }
    courtBlocks.push({
      num: courtNums[c],
      color: colors[c % colors.length],
      label: `${filledInCourt}/${spots} filled`,
      slots,
    })
  }

  // Waitlist rows
  const waitlistRows = waitlist.map((p, i) => {
    const idx = cap + i
    const bg = colors[idx % colors.length]
    return {
      id: p.id,
      name: p.display_name,
      initials: initials(p.display_name),
      brings: (p.bringing || []).map(shortBring),
      hasBring: (p.bringing || []).length > 0,
      pos: i + 1,
      bg,
      fg: fgFor(bg),
      isNext: i === 0,
      ownedByMe: p.user_id === myUid,
    }
  })

  return { spots, courts, courtNums, cap, confirmedCount, waitlist, courtBlocks, waitlistRows }
}
