import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../common/SearchBar'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { itemCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const goSearch = (query) => {
    setOpen(false)
    navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Nova Tech home">
          <span className="brand__mark" aria-hidden="true">N</span>
          <span><strong>NOVA</strong><small>TECH</small></span>
        </Link>
        <nav id="main-menu" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Products</NavLink>
          <NavLink to="/cart" onClick={() => setOpen(false)}>Cart <span className="cart-count">{itemCount}</span></NavLink>
          <NavLink to="/profile" onClick={() => setOpen(false)}>{user ? 'Account' : 'Login'}</NavLink>
          {user?.role === 'admin' ? <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink> : null}
          <div className="mobile-search"><SearchBar compact onSearch={goSearch} /></div>
        </nav>
        <div className="nav-actions">
          <div className="desktop-search"><SearchBar compact onSearch={goSearch} /></div>
          <Link to="/cart" className="cart-link" aria-label={`Cart with ${itemCount} items`}>Cart <span>{itemCount}</span></Link>
          <button type="button" className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="main-menu" aria-label="Toggle navigation menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
