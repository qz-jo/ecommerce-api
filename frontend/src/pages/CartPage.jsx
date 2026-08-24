import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/cart/CartItem'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatCurrency } from '../utils/formatCurrency'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CartPage() {
  useDocumentTitle('Cart')
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()
  const { pushToast } = useToast()
  const [pendingRemove, setPendingRemove] = useState(null)

  const changeQuantity = (id, quantity) => {
    const result = updateQuantity(id, quantity)
    if (!result.success) pushToast(result.message, 'error')
  }

  const confirmRemove = () => {
    if (!pendingRemove) return
    removeFromCart(pendingRemove.id)
    pushToast(`${pendingRemove.name} removed from cart.`, 'success')
    setPendingRemove(null)
  }

  if (!items.length) {
    return <div className="container page-shell"><EmptyState icon="Cart" title="Your cart is empty" description="Browse the catalog and add something you like. Your cart will persist in Local Storage." action={<Link className="btn btn--primary" to="/products">Start shopping</Link>} /></div>
  }

  const shipping = subtotal >= 500 ? 0 : 12
  const total = subtotal + shipping

  return (
    <div className="container page-shell">
      <div className="page-heading"><div><span className="eyebrow">Shopping cart</span><h1>Your cart</h1><p>{items.length} unique product{items.length === 1 ? '' : 's'} saved locally.</p></div></div>
      <div className="cart-layout">
        <section className="cart-list" aria-label="Cart products">{items.map((item) => <CartItem key={item.id} item={item} onQuantityChange={changeQuantity} onRemove={setPendingRemove} />)}</section>
        <aside className="order-summary">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{shipping ? formatCurrency(shipping) : 'Free'}</strong></div>
          <div className="summary-row summary-row--total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          <p className="muted">Free demo shipping on carts over $500.</p>
          <Link className="btn btn--primary btn--lg w-full" to="/checkout">Proceed to checkout</Link>
          <Link className="text-link center-link" to="/products">Continue shopping</Link>
        </aside>
      </div>
      <ConfirmDialog open={Boolean(pendingRemove)} title="Remove product?" description={`Remove ${pendingRemove?.name || 'this product'} from your cart?`} confirmLabel="Remove" danger onClose={() => setPendingRemove(null)} onConfirm={confirmRemove} />
    </div>
  )
}
