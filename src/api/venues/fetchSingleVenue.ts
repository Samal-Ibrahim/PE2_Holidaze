import { VENUES_ENDPOINT } from "@/config/constants"
import type { ApiResponse } from "@/types"
import type { RawVenue, Venue } from "@/types/venue"
import { normalizeVenues } from "@/utils/normalizers/normalizeVenues"

export default async function fetchSingleVenue(id: string): Promise<ApiResponse<Venue[]>> {
	try {
		const response = await fetch(`${VENUES_ENDPOINT}/${id}?_owner=true&_bookings=true`, {
			method: "GET",
			headers: {
				accept: "application/json",
			},
		})
		const data: ApiResponse<RawVenue[]> = await response.json()
		console.log("d", data)
		return {
			...data,
			data: normalizeVenues(data.data),
		}
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
	}
}
