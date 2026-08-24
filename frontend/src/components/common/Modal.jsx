import { useEffect, useRef } from 'react'

export default function Modal({ open, title, children, onClose, actions, size = 'md' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    dialogRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}>
      <div className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} ref={dialogRef}>
        <div className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <div className="modal__body">{children}</div>
        {actions ? <div className="modal__actions">{actions}</div> : null}
      </div>
    </div>
  )
}
