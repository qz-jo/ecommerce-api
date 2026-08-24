import { useId } from 'react'

export default function Input({ label, error, hint, className = '', id, ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div className={`form-field ${className}`.trim()}>
      {label ? <label htmlFor={inputId}>{label}</label> : null}
      <input
        id={inputId}
        className={error ? 'input input--error' : 'input'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      />
      {error ? <p id={errorId} className="field-error">{error}</p> : null}
      {!error && hint ? <p id={hintId} className="field-hint">{hint}</p> : null}
    </div>
  )
}
