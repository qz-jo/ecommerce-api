export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="Product pages">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onPageChange(item)}
          className={item === page ? 'is-active' : ''}
          aria-current={item === page ? 'page' : undefined}
        >{item}</button>
      ))}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
    </nav>
  )
}
