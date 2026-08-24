import { useAuth } from '../../context/AuthContext'
import UnauthorizedPage from '../../pages/UnauthorizedPage'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth()
  if (!user) return <UnauthorizedPage reason="login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <UnauthorizedPage reason="role" />
  return children
}
