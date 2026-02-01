import { PROFILE_API_URL } from "@/config/constants"
import type { ApiResponse, ProfileProps } from "@/types"
import { ApiError, apiCall } from "../apiClient"

export async function fetchProfileByUsername(username: string): Promise<ApiResponse<ProfileProps>> {
	try {
		const data = await apiCall<ApiResponse<ProfileProps>>(`${PROFILE_API_URL}/${username}?_count`, {
			method: "GET",
		})

		return data
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to fetch profile: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
