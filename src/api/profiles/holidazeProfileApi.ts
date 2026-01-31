import { PROFILE_API_URL } from "@/config/constants"
import type { ApiResponse, ProfileProps } from "@/types"
import { ApiError, apiCall, getStoredToken } from "../apiClient"

export async function fetchProfile(username: string): Promise<ApiResponse<ProfileProps>> {
	const token = getStoredToken()
	const apiKey = import.meta.env.VITE_API_KEY

	if (!token) {
		throw new Error("You must be logged in to view profiles")
	}

	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		const data = await apiCall<ApiResponse<ProfileProps>>(
			`${PROFILE_API_URL}/${username}?_bookings=true&_venues=true`,
			{
				method: "GET",
				token,
				apiKey,
			}
		)

		return data
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to fetch profile: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
