interface PaginationBarProps {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function PaginationBar({
  currentPage, totalPages, pageSize, onPageChange, onPageSizeChange,
}: PaginationBarProps) {
  const isFirst = currentPage === 1
  const isLast = currentPage >= totalPages

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    background: 'none',
    border: '1px solid #2a2a2a',
    color: disabled ? '#444' : '#fff',
    borderRadius: '6px',
    padding: '0.25rem 0.6rem',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: '1rem',
    lineHeight: 1,
  })

  return (
    <div
      data-testid="pagination-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0',
        flexWrap: 'wrap',
      }}
    >
      <button
        aria-label="Página anterior"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        style={btnStyle(isFirst)}
      >
        ‹
      </button>

      <span
        style={{
          background: '#646cff',
          color: '#fff',
          borderRadius: '6px',
          padding: '0.2rem 0.6rem',
          fontWeight: 700,
          fontSize: '0.9rem',
          minWidth: '28px',
          textAlign: 'center',
        }}
      >
        {currentPage}
      </span>

      <span style={{ color: '#aaa', fontSize: '0.85rem' }}>de {totalPages}</span>

      <button
        aria-label="Página siguiente"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        style={btnStyle(isLast)}
      >
        ›
      </button>

      <span style={{ marginLeft: 'auto', color: '#aaa', fontSize: '0.85rem' }}>por página</span>

      <select
        value={pageSize}
        onChange={e => onPageSizeChange(Number(e.target.value))}
        style={{
          background: '#1e1e1e',
          border: '1px solid #2a2a2a',
          color: '#fff',
          borderRadius: '6px',
          padding: '0.25rem 0.4rem',
          fontSize: '0.85rem',
          cursor: 'pointer',
        }}
      >
        {[5, 10, 20].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  )
}
