import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../components/common/SearchBar'
import ProductCard from '../components/products/ProductCard'
import CategoryCard from '../components/products/CategoryCard'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function HomePage() {
  useDocumentTitle('Home')
  const navigate = useNavigate()
  const featured = products.filter((product) => product.isFeatured && product.isActive).slice(0, 4)
  const latest = [...products].filter((product) => product.isActive).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">SMART TECH. SIMPLE CHOICES.</span>
            <h1>Upgrade your setup without the guesswork.</h1>
            <p>Discover laptops, phones, audio, accessories, and gaming gear in a clean shopping experience built for every screen.</p>
            <div className="hero__actions">
              <Link className="btn btn--primary btn--lg" to="/products">Shop all products</Link>
              <Link className="btn btn--ghost btn--lg" to="/products?category=Gaming">Explore gaming</Link>
            </div>
            <div className="hero__search"><SearchBar onSearch={(query) => navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ''}`)} placeholder="Search laptops, headphones, phones..." /></div>
            <div className="hero__stats" aria-label="Store highlights">
              <div><strong>20+</strong><span>Curated products</span></div>
              <div><strong>5</strong><span>Tech categories</span></div>
              <div><strong>100%</strong><span>Mock data</span></div>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero-card hero-card--main"><img src="/images/products/product-4.svg" alt="" /></div>
            <div className="hero-card hero-card--float"><span>Featured</span><strong>StudioBook OLED</strong><small>Creator power, vivid color.</small></div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">Browse by category</span><h2>Find your next upgrade</h2></div><Link to="/products" className="text-link">View all products →</Link></div>
        <div className="category-grid">{categories.map((category) => <CategoryCard key={category.id} category={category} />)}</div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Top picks</span><h2>Featured products</h2></div><p>Popular gear selected from every corner of the store.</p></div>
          <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="container promo-banner">
        <div><span className="eyebrow eyebrow--light">THIS WEEK'S PICK</span><h2>Build a cleaner, faster desk setup.</h2><p>Pair the Flux keyboard, Glide mouse, and DockHub for a workspace that stays ready.</p><Link className="btn btn--light" to="/products?category=Accessories">Shop accessories</Link></div>
        <img src="/images/products/product-13.svg" alt="Flux Mechanical Keyboard promotional illustration" />
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">Just added</span><h2>Latest products</h2></div><Link to="/products" className="text-link">Browse catalog →</Link></div>
        <div className="product-grid">{latest.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
    </>
  )
}
