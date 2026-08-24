import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import PasswordInput from '../components/forms/PasswordInput'
import Alert from '../components/common/Alert'
import { validateRegister } from '../utils/validation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function RegisterPage() {
  useDocumentTitle('Create account')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validateRegister(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      window.setTimeout(() => navigate('/login'), 1000)
    }, 700)
  }

  return (
    <div className="auth-page auth-page--wide">
      <section className="auth-card">
        <div className="auth-card__intro"><span className="eyebrow">Create your account</span><h1>Join Nova Tech</h1><p>This form validates locally only. No account is sent to a server in Task 4.</p></div>
        {success ? <Alert type="success" title="Account created">Demo registration completed. Redirecting to sign in...</Alert> : null}
        <form onSubmit={submit} noValidate className="form-grid">
          <Input label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} error={errors.fullName} />
          <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Phone number" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} placeholder="0790000000" />
          <div />
          <PasswordInput label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} hint="8+ characters, uppercase letter, and number." />
          <PasswordInput label="Confirm password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} />
          <div className="form-field form-field--full checkbox-field"><label><input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} /> <span>I agree to the demo terms and privacy notice.</span></label>{errors.terms ? <p className="field-error">{errors.terms}</p> : null}</div>
          <Button type="submit" size="lg" className="form-field--full w-full" loading={loading} disabled={!form.terms}>Create account</Button>
        </form>
        <p className="auth-card__footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </div>
  )
}
