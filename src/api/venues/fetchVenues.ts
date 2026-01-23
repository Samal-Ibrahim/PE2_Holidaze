import { VENUES_ENDPOINT } from "@/config/constants"
import type { ApiResponse } from "@/types"
import type { RawVenues, Venues } from "@/types/venues"
import { normalizeVenues } from "@/utils/normalizers/normalizeVenues"

export default async function fetchVenues(page: number): Promise<ApiResponse<Venues[]>> {
	const apiKey = import.meta.env.VITE_API_KEY || ""
	if (!apiKey) {
		throw new Error("API key is not defined in environment variables")
	}
	try {
		const response = await fetch(
			`${VENUES_ENDPOINT}?sort=created&limit=100&_owner=true&_bookings=true&page=${page}`,
			{
				method: "GET",
				headers: {
					accept: "application/json",
					"content-type": "application/json",
					"X-Noroff-API-Key": apiKey,
				},
			}
		)
		if (!response.ok) {
			throw new Error("Failed to fetch venues")
		}
		const data: ApiResponse<RawVenues[]> = await response.json()
		return {
			...data,
			data: normalizeVenues(data.data),
		} as ApiResponse<Venues[]>
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
	}
}
