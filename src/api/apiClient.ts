// Centralized API client for consistent error handling and token management

export class ApiError extends Error {
	status: number
	errors: Array<{ message: string }>

	constructor(status: number, errors: Array<{ message: string }>, message: string) {
		super(message)
		this.name = "ApiError"
		this.status = status
		this.errors = errors
	}
}

interface ApiClientOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
	headers?: Record<string, string>
	body?: unknown
	token?: string
	apiKey?: string
}

// Make authenticated API requests with consistent error handling
export async function apiCall<T>(url: string, options: ApiClientOptions = {}): Promise<T> {
	const { method = "GET", headers = {}, body, token, apiKey } = options

	const finalHeaders: Record<string, string> = {
		"Content-Type": "application/json",
		accept: "application/json",
		...headers,
	}

	// Add authorization header if token provided
	if (token) {
		finalHeaders.Authorization = `Bearer ${token}`
	}

	// Add API key if provided
	if (apiKey) {
		finalHeaders["X-Noroff-API-Key"] = apiKey
	}

	const fetchOptions: RequestInit = {
		method,
		headers: finalHeaders,
	}

	// Add body for non-GET requests
	if (body && method !== "GET") {
		fetchOptions.body = JSON.stringify(body)
	}

	try {
		const response = await fetch(url, fetchOptions)
		const data = await response.json().catch(() => null)

		// Handle non-OK responses
		if (!response.ok) {
			const errors = data?.errors ?? [{ message: `HTTP ${response.status}` }]
			throw new ApiError(response.status, errors, `API request failed: ${response.statusText}`)
		}

		return data as T
	} catch (error) {
		// Re-throw ApiError as-is
		if (error instanceof ApiError) {
			throw error
		}

		// Handle network errors
		if (error instanceof TypeError) {
			throw new ApiError(
				0,
				[{ message: "Network error. Please check your connection." }],
				error.message
			)
		}

		// Handle other errors
		throw new ApiError(
			0,
			[{ message: "An unexpected error occurred" }],
			error instanceof Error ? error.message : "Unknown error"
		)
	}
}

// Get token from localStorage safely
export function getStoredToken(): string {
	try {
		const userJson = localStorage.getItem("user")
		if (!userJson) return ""

		const user = JSON.parse(userJson)
		return user?.token || ""
	} catch {
		// If localStorage is corrupted, return empty token
		return ""
	}
}

// Validate required environment variables at startup
export function validateEnv(): void {
	const apiKey = import.meta.env.VITE_API_KEY

	if (!apiKey) {
		console.error("Missing required environment variable: VITE_API_KEY")
		throw new Error("Application configuration is incomplete. Please check your .env file.")
	}
}
