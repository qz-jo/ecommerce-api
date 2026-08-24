import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import PasswordInput from '../components/forms/PasswordInput'
import Alert from '../components/common/Alert'
import { useAuth } from '../context/AuthContext'
import { validateLogin } from '../utils/validation'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function LoginPage() {
  useDocumentTitle('Login')
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validateLogin(form)
    setErrors(nextErrors)
    setMessage('')
    if (Object.keys(nextErrors).length) return
    setLoading(true)
    window.setTimeout(() => {
      const result = login(form.email, form.password)
      setLoading(false)
      if (!result.success) return setMessage(result.message)
      const target = result.user.role === 'admin' ? '/admin' : (location.state?.from || '/profile')
      navigate(target, { replace: true })
    }, 650)
  }

  const setDemo = (role) => {
    setForm(role === 'admin'
      ? { email: 'admin@example.com', password: 'Admin123!' }
      : { email: 'customer@example.com', password: 'Customer123!' })
    setErrors({})
    setMessage('')
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-card__intro"><span className="eyebrow">Welcome back</span><h1>Sign in to Nova Tech</h1><p>Use a local demo account to test protected customer and admin pages.</p></div>
        {message ? <Alert type="error" title="Sign in failed">{message}</Alert> : null}
        <form onSubmit={submit} noValidate className="form-stack">
          <Input label="Email address" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="you@example.com" />
          <PasswordInput label="Password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          <Button type="submit" size="lg" className="w-full" loading={loading}>Sign in</Button>
        </form>
        <div className="demo-accounts"><strong>Demo accounts</strong><div><button type="button" onClick={() => setDemo('customer')}>Use customer account</button><button type="button" onClick={() => setDemo('admin')}>Use admin account</button></div></div>
        <p className="auth-card__footer">New to Nova Tech? <Link to="/register">Create an account</Link></p>
      </section>
    </div>
  )
}
