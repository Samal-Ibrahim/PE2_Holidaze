import { ToastContainer } from "react-toastify"
import { Header } from "./components/Header/Index"
import AppRoutes from "./routes/AppRoutes"
import "react-toastify/dist/ReactToastify.css"
import Footer from "./components/Footer/index"

function App() {
	return (
		<div className="grid grid-rows-[auto_1fr_auto] sm:container mx-auto min-h-screen gap-4">
			<div className="w-full">
				<Header />
			</div>
			<main>
				<ToastContainer position="top-right" autoClose={2000} />
				<AppRoutes />
			</main>
			<div>
				<Footer />
			</div>
		</div>
	)
}

export default App
