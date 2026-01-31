import { VENUES_ENDPOINT } from "@/config/constants"
import type { ApiResponse } from "@/types"
import type { RawVenues, Venues } from "@/types/venues"
import { normalizeVenues } from "@/utils/normalizeVenues"
import { ApiError, apiCall } from "../apiClient"

export async function fetchVenues(page: number): Promise<ApiResponse<Venues[]>> {
	const apiKey = import.meta.env.VITE_API_KEY

	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		const url = `${VENUES_ENDPOINT}?sort=created&limit=100&_owner=true&_bookings=true&page=${page}`

		const data = await apiCall<ApiResponse<RawVenues[]>>(url, {
			method: "GET",
			apiKey,
		})

		return {
			...data,
			data: normalizeVenues(data.data),
		} as ApiResponse<Venues[]>
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to fetch venues: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
