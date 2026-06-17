// The circular "Dink Playa" seal logo. Ported verbatim from the prototype.
export default function Seal({ accent = '#c2602e', size = 94 }) {
  return (
    <div style={{ flex: 'none', lineHeight: 0, filter: 'drop-shadow(3px 3px 0 #1a1a1a)' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="dinkTop" d="M 14,50 A 36,36 0 0 1 86,50" />
          <path id="dinkBot" d="M 13,50 A 37,37 0 0 0 87,50" />
        </defs>
        <circle cx="50" cy="50" r="48" fill="#efe6d4" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="50" cy="50" r="44" fill="none" stroke={accent} strokeWidth="2" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
        <text fontFamily="'Bricolage Grotesque',sans-serif" fontWeight="800" fontSize="6.6" letterSpacing="2.2" fill="#1a1a1a">
          <textPath href="#dinkTop" startOffset="50%" textAnchor="middle">PICKLEBALL</textPath>
        </text>
        <text fontFamily="'Bricolage Grotesque',sans-serif" fontWeight="800" fontSize="6.4" letterSpacing="2.8" fill="#1a1a1a">
          <textPath href="#dinkBot" startOffset="50%" textAnchor="middle">EST 2026</textPath>
        </text>
        <text x="50" y="46.5" textAnchor="middle" fontFamily="'Bricolage Grotesque',sans-serif" fontWeight="800" fontSize="15" letterSpacing="-1" fill="#1a1a1a">DINK</text>
        <line x1="41" y1="51.5" x2="59" y2="51.5" stroke={accent} strokeWidth="1.6" />
        <text x="50" y="61.5" textAnchor="middle" fontFamily="'Bricolage Grotesque',sans-serif" fontWeight="800" fontSize="10.5" letterSpacing="1.2" fill="#1a1a1a">PLAYA</text>
        <rect x="-1.8" y="-1.8" width="3.6" height="3.6" fill={accent} transform="translate(11.5,50) rotate(45)" />
        <rect x="-1.8" y="-1.8" width="3.6" height="3.6" fill={accent} transform="translate(88.5,50) rotate(45)" />
      </svg>
    </div>
  )
}
