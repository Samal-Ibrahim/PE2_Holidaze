import { VENUES_ENDPOINT } from "@/config/constants"
import type { ApiResponse } from "@/types"
import type { Venue } from "@/types/venue"
import type { RawVenues } from "@/types/venues"
import { normalizeSingleVenue } from "@/utils/normalizeSingleVenue"
import { ApiError, apiCall } from "../apiClient"

export async function fetchSingleVenue(id: string): Promise<ApiResponse<Venue>> {
	try {
		const data = await apiCall<ApiResponse<RawVenues>>(
			`${VENUES_ENDPOINT}/${id}?_owner=true&_bookings=true`,
			{
				method: "GET",
			}
		)

		return {
			...data,
			data: normalizeSingleVenue(data.data),
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to fetch venue: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
