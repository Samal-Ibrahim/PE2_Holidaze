import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "../src/styles/index.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./context/AuthContext"
import { EditToggleProvider } from "./context/EditToggleContext"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Data stays fresh for 5 min before refetching
			staleTime: 1000 * 60 * 5,
			// Keep data in cache for 10 min before garbage collecting
			gcTime: 1000 * 60 * 10,
			retry: 1,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 0,
		},
	},
})

const rootElement = document.getElementById("root")
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<EditToggleProvider>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</EditToggleProvider>
				</AuthProvider>
			</QueryClientProvider>
		</React.StrictMode>
	)
}
