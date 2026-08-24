export default function Loader({ label = 'Loading content' }) {
  return (
    <div className="loader-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
