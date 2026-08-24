import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand--footer"><span className="brand__mark">N</span><span><strong>NOVA</strong><small>TECH</small></span></div>
          <p>A responsive React storefront prototype built entirely with local mock data.</p>
        </div>
        <div><h3>Shop</h3><Link to="/products">All products</Link><Link to="/products?category=Laptops">Laptops</Link><Link to="/products?category=Gaming">Gaming</Link></div>
        <div><h3>Account</h3><Link to="/login">Sign in</Link><Link to="/register">Create account</Link><Link to="/profile">Profile</Link></div>
        <div><h3>Project</h3><p>No live API connection in Task 4.</p><p>Prepared for API integration in Task 5.</p></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 Nova Tech</span><span>React + Vite + React Router</span></div>
    </footer>
  )
}
