import { VENUES_ENDPOINT } from "@/config/constants"
import type { ApiResponse } from "@/types"
import type { RawVenue, Venue } from "@/types/venue"
import { normalizeVenues } from "@/utils/normalizers/normalizeVenues"

export default async function fetchVenues(): Promise<ApiResponse<Venue[]>> {
	const apiKey = import.meta.env.VITE_API_KEY || ""
	if (!apiKey) {
		throw new Error("API key is not defined in environment variables")
	}
	try {
		const response = await fetch(`${VENUES_ENDPOINT}?_owner=true&_bookings=true&limit=12`, {
			method: "GET",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				"X-Noroff-API-Key": apiKey,
			},
		})
		if (!response.ok) {
			throw new Error("Failed to fetch venues")
		}
		const data: ApiResponse<RawVenue[]> = await response.json()
		return {
			...data,
			data: normalizeVenues(data.data),
		}
	} catch (error) {
		throw new Error(`Error fetching venues: ${error}`)
	}
}
