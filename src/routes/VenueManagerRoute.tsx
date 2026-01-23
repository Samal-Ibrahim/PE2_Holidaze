import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import userProfile from "@/api/profiles/holidazeProfile"
import { useAuth } from "@/hooks/useAuth"

const VenueManagerRoute = () => {
	const location = useLocation()

	const { user } = useAuth()
	const username = user?.name

	const { data } = useQuery({
		queryKey: ["profile", username],
		queryFn: () => userProfile(username as string),
		enabled: !!username,
	})

	const venueManager = !!data?.data?.venueManager

	if (!venueManager) {
		return <Navigate to="/profile" state={{ from: location }} replace />
	}
	return <Outlet />
}

export default VenueManagerRoute
