import { PROFILE_UPDATE_API_URL } from "@/config/constants"
import { ApiError, AuthenticationError } from "@/lib/errors"
import type { ProfileUpdatePayload } from "@/types"

export default async function updateProfileApi(payload: ProfileUpdatePayload) {
	const authData = JSON.parse(localStorage.getItem("user") || "{}")
	const token = authData?.token
	const username = authData?.name

	if (!token || !username) {
		throw new AuthenticationError("User is not authenticated")
	}
	const response = await fetch(`${PROFILE_UPDATE_API_URL}/${username}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			accept: "application/json",
			Authorization: `Bearer ${token}`,
			"X-Noroff-API-Key": import.meta.env.VITE_API_KEY || "",
		},
		body: JSON.stringify(payload),
	})

	if (!response.ok) {
		throw new ApiError("Failed to update profile data")
	}
}
