import { PROFILE_UPDATE_API_URL } from "@/config/constants"
import type { ProfileUpdatePayload } from "@/types"
import { ApiError, apiCall, getStoredToken } from "../apiClient"

export async function updateProfile(payload: ProfileUpdatePayload): Promise<void> {
	const token = getStoredToken()
	const apiKey = import.meta.env.VITE_API_KEY

	if (!token) {
		throw new Error("You must be logged in to update your profile")
	}

	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		// Get username from localStorage directly since we need it for the API endpoint
		const userJson = localStorage.getItem("user")
		const user = userJson ? JSON.parse(userJson) : null
		const username = user?.name

		if (!username) {
			throw new Error("Username not found. Please log in again.")
		}

		await apiCall<{ data: null }>(`${PROFILE_UPDATE_API_URL}/${username}`, {
			method: "PUT",
			body: payload,
			token,
			apiKey,
		})
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to update profile: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
