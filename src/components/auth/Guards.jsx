import { Navigate, Outlet } from 'react-router-dom'
import { ROLES } from '../../config/roles'

// Note: Replace with actual auth logic
const getAuthUser = () => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')
  return {
    isAuthenticated: !!token,
    role: role
  }
}

export function ProtectedRoute() {
  const user = getAuthUser()
  
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function RoleGuard({ allowedRoles }) {
  const user = getAuthUser()

  if (!allowedRoles.includes(user.role)) {
    if (user.role === ROLES.SANGH_ADMIN) return <Navigate to="/sangh-admin" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
