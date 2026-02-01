import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { fetchProfile } from "@/api/profiles/holidazeProfileApi"
import { useAuth } from "@/hooks/useAuth"

const VenueManagerRoute = () => {
	const location = useLocation()

	const { user } = useAuth()
	const username = user?.name

	const { data, isLoading } = useQuery({
		queryKey: ["profile", username],
		queryFn: () => fetchProfile(username as string),
		enabled: !!username,
	})

	const venueManager = !!data?.data?.venueManager

	// Show loading state while fetching profile
	if (isLoading) {
		return <div>Loading...</div>
	}

	if (!venueManager) {
		return <Navigate to="/profile" state={{ from: location }} replace />
	}
	return <Outlet />
}

export default VenueManagerRoute
