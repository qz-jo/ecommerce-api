export default function Alert({ type = 'info', title, children, action }) {
  return (
    <div className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <div>
        {title ? <strong>{title}</strong> : null}
        {children ? <div className="alert__body">{children}</div> : null}
      </div>
      {action ? <div className="alert__action">{action}</div> : null}
    </div>
  )
}
