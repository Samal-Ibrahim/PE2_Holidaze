import { PROFILE_API_URL } from "@/config/constants"
import { AuthenticationError } from "@/lib/errors"
import type { ApiResponse, Profile } from "@/types"

export default async function userProfile(username: string): Promise<ApiResponse<Profile>> {
	const token = JSON.parse(localStorage.getItem("user") || "{}").token || ""
	const apiKey = import.meta.env.VITE_API_KEY || ""
	if (!apiKey) {
		throw new AuthenticationError("API key is not defined in environment variables")
	}
	if (!token) {
		throw new AuthenticationError("User token is not available")
	}
	const response = await fetch(`${PROFILE_API_URL}/${username}?_bookings=true&_venues=true`, {
		method: "GET",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			Authorization: `Bearer ${token}`,
			"X-Noroff-API-Key": apiKey,
		},
	})
	if (!response.ok) {
		throw new Error("Failed to fetch user profile")
	}
	const data = await response.json()
	return data
}
