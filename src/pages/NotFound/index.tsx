import { Link } from "react-router-dom"

const NotFound = () => {
	return (
		<div className="flex items-center justify-center p-4 h-full">
			<div className="text-center">
				<h1 className="text-6xl font-bold mb-4">404</h1>
				<p className="text-xl text-gray-600 mb-6">Page not found</p>
				<Link to="/" className="btn">
					Back to Home
				</Link>
			</div>
		</div>
	)
}

export default NotFound
