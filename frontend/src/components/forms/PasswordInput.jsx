import { useId, useState } from 'react'

export default function PasswordInput({ label = 'Password', error, hint, ...props }) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-field">
        <input
          {...props}
          id={id}
          type={visible ? 'text' : 'password'}
          className={error ? 'input input--error' : 'input'}
          aria-invalid={Boolean(error)}
        />
        <button type="button" className="password-toggle" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}
