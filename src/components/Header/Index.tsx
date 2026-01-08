import { useEffect, useState } from "react"
import { FaMoon, FaSun } from "react-icons/fa"
import { Link } from "react-router-dom"

export const Header = () => {
	const [isDarkMode, setIsDarkMode] = useState(false)
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
	}, [isDarkMode])

	return (
		<div className="flex flex-col justify-between items-center">
			<h2 className="text-md font-bold color-text">Holidaze</h2>
			<nav className="color-text flex items-center justify-center">
				<div className="flex space-x-4">
					<Link className="nav-link" to="/">
						Home
					</Link>
					<Link className="nav-link" to="/profile">
						Profile
					</Link>
					<Link className="nav-link" to="/venues">
						Venues
					</Link>
					<Link className="nav-link" to="/about">
						About
					</Link>
					<Link className="nav-link" to="/contact">
						Contact
					</Link>
					<button
						type="button"
						className="cursor-pointer hover:transform hover:scale-130 transition-transform"
						onClick={() => setIsDarkMode(!isDarkMode)}
					>
						{isDarkMode ? <FaMoon /> : <FaSun />}
					</button>
				</div>
			</nav>
		</div>
	)
}
