import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const ProtectedRoute = () => {
	const { user } = useAuth()
	const isLoggedIn = Boolean(user)
	const location = useLocation()

	if (!isLoggedIn) {
		return <Navigate to="/login" state={{ from: location }} replace />
	}
	return <Outlet />
}

export default ProtectedRoute
