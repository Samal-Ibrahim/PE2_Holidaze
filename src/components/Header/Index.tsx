import { Link, useNavigate } from "react-router-dom"
import {
	LOGIN_PAGE_URL,
	PROFILE_PAGE_URL,
	REGISTER_PAGE_URL,
	VENUES_PAGE_URL,
} from "@/config/constants"

import { useAuth } from "@/hooks/useAuth"
export const Header = () => {
	const { logout, user } = useAuth()
	const navigate = useNavigate()

	return (
		<div className="flex flex-col justify-between mt-6 items-center">
			<h2 className="text-3xl font-bold color-text">Holidaze</h2>
			<nav className="color-text flex items-center gap-8 justify-center">
				<div className="flex space-x-4">
					<Link className={`nav-link`} to={VENUES_PAGE_URL}>
						Venues
					</Link>
					<Link className={`nav-link ${user ? "block" : "hidden"}`} to={PROFILE_PAGE_URL}>
						Profile
					</Link>

					<Link className={`nav-link ${!user ? "block" : "hidden"}`} to={LOGIN_PAGE_URL}>
						Login
					</Link>
					<Link className={`nav-link ${!user ? "block" : "hidden"}`} to={REGISTER_PAGE_URL}>
						Register
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
