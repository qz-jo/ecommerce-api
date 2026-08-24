export default function StatusBadge({ status }) {
  const key = status.toLowerCase().replace(/\s+/g, '-')
  return <span className={`status-badge status-badge--${key}`}>{status}</span>
}
