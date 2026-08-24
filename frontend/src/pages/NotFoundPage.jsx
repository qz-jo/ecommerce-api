import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('404')
  return (
    <div className="not-found container">
      <span className="not-found__code">404</span>
      <span className="eyebrow">Page not found</span>
      <h1>This route wandered off.</h1>
      <p>The page you requested does not exist. Use the links below to return to the store.</p>
      <div><Link className="btn btn--primary" to="/">Go home</Link><Link className="btn btn--secondary" to="/products">Browse products</Link></div>
    </div>
  )
}
