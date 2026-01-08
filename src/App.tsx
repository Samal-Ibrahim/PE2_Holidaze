import { Header } from "./components/Header/Index"
import AppRoutes from "./routes/AppRoutes"

function App() {
	return (
		<div className="grid grid-rows-[auto_1fr_auto] mx-auto px-2 min-h-screen container">
			<div className="w-full">
				<Header />
			</div>
			<div className="">
				<AppRoutes />
			</div>
			<div>
				<p>Footer content &copy; {new Date().getFullYear()} Holidaze</p>
			</div>
		</div>
	)
}

export default App
