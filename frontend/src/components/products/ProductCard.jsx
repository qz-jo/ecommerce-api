import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { formatCurrency } from '../../utils/formatCurrency'
import Button from '../common/Button'
import StockBadge from '../common/StockBadge'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { pushToast } = useToast()

  const handleAdd = () => {
    const result = addToCart(product, 1)
    pushToast(result.message, result.success ? 'success' : 'error')
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__image-link" aria-label={`View ${product.name}`}>
        <img src={product.image} alt={`${product.name} product illustration`} className="product-card__image" />
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <StockBadge stock={product.stockQuantity} />
        </div>
        <h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__footer">
          <strong className="price">{formatCurrency(product.price)}</strong>
          <Button size="sm" onClick={handleAdd} disabled={product.stockQuantity === 0}>Add to cart</Button>
        </div>
      </div>
    </article>
  )
}
