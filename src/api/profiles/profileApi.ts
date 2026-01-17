import { PROFILE_API_URL } from "@/config/constants"
import { ApiError } from "@/lib/errors"
import type { ApiResponse, Profile } from "@/types"

export default async function profile_api(username: string): Promise<ApiResponse<Profile>> {
	const response = await fetch(`${PROFILE_API_URL}/${username}?=_count`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})

	if (!response.ok) {
		throw new ApiError("Failed to fetch profile data")
	}

	const data = await response.json()
	return data
}
