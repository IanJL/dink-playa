const BRICOLAGE = "'Bricolage Grotesque',sans-serif"

export default function SignupBar({ value, onChange, onAdd, accent }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 14,
        marginTop: 24,
        background: '#fff',
        border: '2.5px solid #1a1a1a',
        borderRadius: 999,
        padding: '7px 7px 7px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: `5px 5px 0 ${accent}`,
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onAdd()
        }}
        placeholder="Your name…"
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontFamily: "'Hanken Grotesk'",
          fontSize: 16,
          fontWeight: 600,
          background: 'transparent',
          color: '#1a1a1a',
          minWidth: 0,
        }}
      />
      <button
        onClick={onAdd}
        style={{
          background: '#1a1a1a',
          color: '#efe6d4',
          border: 'none',
          borderRadius: 999,
          padding: '12px 22px',
          fontFamily: BRICOLAGE,
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          flex: 'none',
        }}
      >
        Add me
      </button>
    </div>
  )
}
