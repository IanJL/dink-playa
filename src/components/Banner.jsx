// Transient status toast.
export default function Banner({ status, onDismiss }) {
  if (!status) return null
  const bg =
    status.kind === 'confirmed' ? '#2f8f3e' : status.kind === 'waitlist' ? '#e07a1f' : '#1a1a1a'
  return (
    <div
      style={{
        background: bg,
        color: '#fff',
        border: '2.5px solid #1a1a1a',
        borderRadius: 14,
        padding: '13px 14px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        boxShadow: '4px 4px 0 #1a1a1a',
        animation: 'dcDrop .28s ease',
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 15 }}>{status.msg}</span>
      <button
        onClick={onDismiss}
        style={{
          background: 'rgba(0,0,0,.18)',
          color: '#fff',
          border: 'none',
          width: 24,
          height: 24,
          borderRadius: 999,
          fontWeight: 800,
          cursor: 'pointer',
          flex: 'none',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  )
}
