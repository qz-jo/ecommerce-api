export default function EmptyState({ icon = '○', title, description, action }) {
  return (
    <section className="empty-state" aria-live="polite">
      <div className="empty-state__icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </section>
  )
}
