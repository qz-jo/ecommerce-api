import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/common/Button'
import StockBadge from '../components/common/StockBadge'
import ProductCard from '../components/products/ProductCard'
import EmptyState from '../components/common/EmptyState'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatCurrency } from '../utils/formatCurrency'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = products.find((item) => item.id === Number(id) && item.isActive)
  useDocumentTitle(product?.name || 'Product not found')
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { pushToast } = useToast()

  const similar = useMemo(() => product ? products.filter((item) => item.category === product.category && item.id !== product.id && item.isActive).slice(0, 3) : [], [product])

  if (!product) {
    return <div className="container page-shell"><EmptyState title="Product not found" description="This product does not exist or is currently inactive." action={<Link className="btn btn--primary" to="/products">Back to products</Link>} /></div>
  }

  const add = () => {
    const result = addToCart(product, quantity)
    pushToast(result.message, result.success ? 'success' : 'error')
  }

  return (
    <div className="container page-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span><span>{product.name}</span></nav>
      <section className="product-detail">
        <div className="product-detail__media"><img src={product.image} alt={`${product.name} product illustration`} /></div>
        <div className="product-detail__content">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-price-row"><strong>{formatCurrency(product.price)}</strong><StockBadge stock={product.stockQuantity} /></div>
          <p className="lead">{product.description}</p>
          <div className="detail-points"><div><strong>Fast setup</strong><span>Designed for everyday use.</span></div><div><strong>Local demo</strong><span>No backend request is made.</span></div><div><strong>Responsive</strong><span>Optimized for desktop and mobile.</span></div></div>
          <div className="purchase-box">
            <div className="form-field quantity-field"><label htmlFor="detail-quantity">Quantity</label><input id="detail-quantity" className="input" type="number" min="1" max={Math.max(1, product.stockQuantity)} value={quantity} disabled={product.stockQuantity === 0} onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value) || 1), Math.max(1, product.stockQuantity)))} /></div>
            <Button size="lg" className="purchase-box__button" disabled={product.stockQuantity === 0} onClick={add}>{product.stockQuantity === 0 ? 'Out of stock' : 'Add to cart'}</Button>
          </div>
          {product.stockQuantity > 0 ? <p className="field-hint">You can add up to {product.stockQuantity} unit(s) across the cart.</p> : <p className="field-error">This item cannot be added until stock is available.</p>}
        </div>
      </section>

      <section className="section section--compact">
        <div className="section-heading"><div><span className="eyebrow">More like this</span><h2>Similar products</h2></div></div>
        <div className="product-grid product-grid--three">{similar.map((item) => <ProductCard key={item.id} product={item} />)}</div>
      </section>
    </div>
  )
}
