import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function UnauthorizedPage({ reason = 'role' }) {
  useDocumentTitle('Unauthorized')
  const login = reason === 'login'
  return (
    <div className="container page-shell">
      <EmptyState
        icon="!"
        title={login ? 'Sign in required' : 'You do not have access'}
        description={login ? 'This page is protected. Sign in with a demo customer or admin account to continue.' : 'This route requires the admin role. A customer account cannot open the admin dashboard.'}
        action={<Link className="btn btn--primary" to={login ? '/login' : '/'}>{login ? 'Go to sign in' : 'Back to home'}</Link>}
      />
    </div>
  )
}
