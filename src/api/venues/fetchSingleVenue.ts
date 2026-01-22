import { VENUES_ENDPOINT } from "@/config/constants"
import type { ApiResponse } from "@/types"
import type { Venue } from "@/types/venue"
import type { RawVenues } from "@/types/venues"

import { normalizeSingleVenue } from "@/utils/normalizers/normalizeSingleVenue"

export default async function fetchSingleVenue(id: string): Promise<ApiResponse<Venue>> {
	try {
		const response = await fetch(`${VENUES_ENDPOINT}/${id}?_owner=true&_bookings=true`, {
			method: "GET",
			headers: {
				accept: "application/json",
			},
		})
		const data: ApiResponse<RawVenues> = await response.json()
		console.log("d", data.data)
		return {
			...data,
			data: normalizeSingleVenue(data.data),
		}
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
	}
}
