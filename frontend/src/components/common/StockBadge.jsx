export default function StockBadge({ stock }) {
  const status = stock === 0 ? 'Out of stock' : stock <= 5 ? `Only ${stock} left` : 'In stock'
  const tone = stock === 0 ? 'danger' : stock <= 5 ? 'warning' : 'success'
  return <span className={`stock-badge stock-badge--${tone}`}>{status}</span>
}
