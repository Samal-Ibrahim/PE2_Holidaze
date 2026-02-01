import { useQuery } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { fetchProfile } from "@/api/profiles/holidazeProfileApi"
import {
	CREATE_VENUE_PAGE_URL,
	LOGIN_PAGE_URL,
	PROFILE_PAGE_URL,
	REGISTER_PAGE_URL,
	VENUES_PAGE_URL,
} from "@/config/constants"
import { useAuth } from "@/hooks/useAuth"

export const Header = () => {
	const { logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()

	const { user } = useAuth()
	const username = user?.name

	const { data } = useQuery({
		queryKey: ["profile", username],
		queryFn: () => fetchProfile(username as string),
		enabled: !!username,
	})

	const venueManager = !!data?.data?.venueManager

	return (
		<div className="flex flex-col justify-between mt-6 items-center">
			<h2 className="text-3xl font-bold color-text">Holidaze</h2>
			<nav className="color-text flex items-center gap-8 justify-center">
				<div className="flex space-x-4">
					<Link
						className={`nav-link ${location.pathname === VENUES_PAGE_URL ? "bg-black! text-white!" : ""}`}
						to={VENUES_PAGE_URL}
					>
						Venues
					</Link>
					<Link
						className={`nav-link ${user ? "block" : "hidden"} ${location.pathname === PROFILE_PAGE_URL ? "bg-black! text-white!" : ""}`}
						to={PROFILE_PAGE_URL}
					>
						Profile
					</Link>

					<Link
						className={`nav-link ${!user ? "block" : "hidden"} ${location.pathname === LOGIN_PAGE_URL ? "bg-black! text-white!" : ""}`}
						to={LOGIN_PAGE_URL}
					>
						Login
					</Link>
					<Link
						className={`nav-link ${!user ? "block" : "hidden"} ${location.pathname === REGISTER_PAGE_URL ? "bg-black! text-white!" : ""}`}
						to={REGISTER_PAGE_URL}
					>
						Register
					</Link>
					<Link
						className={`nav-link ${venueManager ? "block" : "hidden"} ${location.pathname === CREATE_VENUE_PAGE_URL ? "bg-black! text-white!" : ""}`}
						to={CREATE_VENUE_PAGE_URL}
					>
						Create
					</Link>

					<button
						className={`nav-link ${user ? "block" : "hidden"}`}
						type="button"
						onClick={() => {
							logout()
							navigate(LOGIN_PAGE_URL)
						}}
					>
						Logout
					</button>
				</div>
			</nav>
		</div>
	)
}
