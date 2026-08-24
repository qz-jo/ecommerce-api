import { formatCurrency } from '../../utils/formatCurrency'

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <article className="cart-item">
      <img src={item.image} alt={`${item.name} in cart`} />
      <div className="cart-item__info">
        <span className="eyebrow">{item.category}</span>
        <h3>{item.name}</h3>
        <span className="muted">{formatCurrency(item.price)} each</span>
      </div>
      <div className="quantity-control">
        <button type="button" onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease ${item.name} quantity`}>−</button>
        <span aria-live="polite">{item.quantity}</span>
        <button type="button" onClick={() => onQuantityChange(item.id, item.quantity + 1)} disabled={item.quantity >= item.stockQuantity} aria-label={`Increase ${item.name} quantity`}>+</button>
      </div>
      <strong className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</strong>
      <button type="button" className="text-btn text-btn--danger" onClick={() => onRemove(item)}>Remove</button>
    </article>
  )
}
