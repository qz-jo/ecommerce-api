import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Alert from '../components/common/Alert'
import EmptyState from '../components/common/EmptyState'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { validateCheckout } from '../utils/validation'
import { formatCurrency } from '../utils/formatCurrency'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CheckoutPage() {
  useDocumentTitle('Checkout')
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.fullName || '', phone: user?.phone || '', address: '', city: '', payment: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')

  if (!items.length && !orderId) return <div className="container page-shell"><EmptyState title="Nothing to checkout" description="Your cart is empty. Add a product before completing a demo order." action={<Link className="btn btn--primary" to="/products">Browse products</Link>} /></div>

  const shipping = subtotal >= 500 ? 0 : 12
  const total = subtotal + shipping

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validateCheckout(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      const generated = `NT-${Math.floor(100000 + Math.random() * 900000)}`
      setOrderId(generated)
      clearCart()
    }, 850)
  }

  if (orderId) {
    return <div className="container page-shell"><div className="success-panel"><span className="success-panel__icon" aria-hidden="true">✓</span><span className="eyebrow">Order confirmed</span><h1>Thanks! Your demo order is complete.</h1><p>Your local order number is <strong>{orderId}</strong>. No payment was processed and no backend request was made.</p><Link className="btn btn--primary" to="/products">Continue shopping</Link></div></div>
  }

  return (
    <div className="container page-shell">
      <div className="page-heading"><div><span className="eyebrow">Checkout</span><h1>Complete your order</h1><p>Enter demo delivery information and choose a simulated payment method.</p></div></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit} noValidate>
          <h2>Delivery details</h2>
          <div className="form-grid">
            <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
            <Input className="form-field--full" label="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} placeholder="Building, street, area" />
            <div className="form-field"><label htmlFor="city">City</label><select id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={errors.city ? 'input input--error' : 'input'}><option value="">Choose city</option><option>Amman</option><option>Irbid</option><option>Zarqa</option><option>Aqaba</option></select>{errors.city ? <p className="field-error">{errors.city}</p> : null}</div>
          </div>
          <h2>Payment</h2>
          <div className="payment-options">
            {['Cash on delivery', 'Demo card', 'Demo wallet'].map((option) => <label key={option} className={form.payment === option ? 'payment-option is-active' : 'payment-option'}><input type="radio" name="payment" value={option} checked={form.payment === option} onChange={(e) => setForm({ ...form, payment: e.target.value })} /><span><strong>{option}</strong><small>Simulation only</small></span></label>)}
          </div>
          {errors.payment ? <p className="field-error">{errors.payment}</p> : null}
          <Alert type="info" title="Task 4 demo">Checkout uses local mock data only. No real payment or API request will occur.</Alert>
          <Button type="submit" size="lg" loading={loading}>Place demo order</Button>
        </form>
        <aside className="order-summary order-summary--checkout"><h2>Items</h2>{items.map((item) => <div className="checkout-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>Qty {item.quantity}</span></div><strong>{formatCurrency(item.price * item.quantity)}</strong></div>)}<div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div className="summary-row"><span>Shipping</span><strong>{shipping ? formatCurrency(shipping) : 'Free'}</strong></div><div className="summary-row summary-row--total"><span>Total</span><strong>{formatCurrency(total)}</strong></div></aside>
      </div>
    </div>
  )
}
