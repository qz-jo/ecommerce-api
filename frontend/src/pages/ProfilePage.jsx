import { useState } from 'react'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import PasswordInput from '../components/forms/PasswordInput'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Alert from '../components/common/Alert'
import StatusBadge from '../components/common/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { demoOrders } from '../data/orders'
import { formatCurrency } from '../utils/formatCurrency'
import { useToast } from '../context/ToastContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function ProfilePage() {
  useDocumentTitle('Profile')
  const { user, updateProfile, logout } = useAuth()
  const { pushToast } = useToast()
  const [profile, setProfile] = useState({ fullName: user.fullName, phone: user.phone })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [logoutOpen, setLogoutOpen] = useState(false)

  const saveProfile = (event) => {
    event.preventDefault()
    if (profile.fullName.trim().length < 3 || !/^07\d{8}$/.test(profile.phone)) {
      pushToast('Enter a valid name and Jordanian mobile number.', 'error')
      return
    }
    updateProfile(profile)
    pushToast('Profile updated locally.', 'success')
  }

  const changePassword = (event) => {
    event.preventDefault()
    if (!passwords.current || passwords.next.length < 8 || !/[A-Z]/.test(passwords.next) || !/\d/.test(passwords.next)) {
      setPasswordError('Enter the current password and a new 8+ character password with uppercase and number.')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError('New passwords do not match.')
      return
    }
    setPasswordError('')
    setPasswords({ current: '', next: '', confirm: '' })
    pushToast('Demo password validation passed. No backend change was made.', 'success')
  }

  return (
    <div className="container page-shell">
      <div className="profile-head">
        <div><span className="eyebrow">Customer account</span><h1>Hi, {user.fullName.split(' ')[0]}</h1><p>Manage local profile data and review demo order history.</p></div>
        <Button variant="secondary" onClick={() => setLogoutOpen(true)}>Sign out</Button>
      </div>
      <div className="profile-grid">
        <section className="profile-card">
          <h2>Personal information</h2>
          <form onSubmit={saveProfile} className="form-stack">
            <Input label="Full name" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
            <Input label="Email address" value={user.email} disabled hint="Email is fixed in this demo." />
            <Input label="Phone number" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <Button type="submit">Save changes</Button>
          </form>
        </section>
        <section className="profile-card">
          <h2>Change password</h2>
          <form onSubmit={changePassword} className="form-stack">
            <PasswordInput label="Current password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
            <PasswordInput label="New password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
            <PasswordInput label="Confirm new password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
            {passwordError ? <Alert type="error">{passwordError}</Alert> : null}
            <Button type="submit" variant="secondary">Validate password change</Button>
          </form>
        </section>
      </div>

      <section className="section section--compact">
        <div className="section-heading"><div><span className="eyebrow">Order history</span><h2>Your recent orders</h2></div><span className="muted">5 demo orders</span></div>
        <div className="orders-list">
          {demoOrders.map((order) => (
            <article className="order-row" key={order.id}>
              <div><strong>{order.id}</strong><span>{order.date}</span></div>
              <div><span>{order.items} item{order.items === 1 ? '' : 's'}</span><strong>{formatCurrency(order.total)}</strong></div>
              <StatusBadge status={order.status} />
            </article>
          ))}
        </div>
      </section>
      <ConfirmDialog open={logoutOpen} title="Sign out?" description="Your mock login session will be cleared from Local Storage." confirmLabel="Sign out" onClose={() => setLogoutOpen(false)} onConfirm={logout} />
    </div>
  )
}
