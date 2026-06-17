// Color palettes from the design handoff. Default is "Sunset".
// Change ACTIVE_PALETTE to 'Court' or 'Mono' to reskin the whole app.

export const PALETTES = {
  Sunset: { colors: ['#c2602e', '#d99a2b', '#6b7d3a', '#a8482a', '#8a5a38'], accent: '#c2602e' },
  Court:  { colors: ['#2b5a7a', '#2f807a', '#3f7d44', '#d99a2b', '#557a2f'], accent: '#2f807a' },
  Mono:   { colors: ['#1f1f1f', '#c2602e', '#5a4a3c', '#857463', '#3a342e'], accent: '#c2602e' },
}

export const ACTIVE_PALETTE = 'Sunset'

export function palette() {
  return PALETTES[ACTIVE_PALETTE] || PALETTES.Sunset
}
