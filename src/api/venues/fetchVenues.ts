import { VENUES_ENDPOINT } from "@/config/constants"

import type { ApiResponse } from "@/types"
import type { Venue } from "@/types/venue"

export default async function fetchVenues(): Promise<ApiResponse<Venue[]>> {
	const apiKey = import.meta.env.VITE_API_KEY || ""
	if (!apiKey) {
		throw new Error("API key is not defined in environment variables")
	}
	try {
		const response = await fetch(`${VENUES_ENDPOINT}?sort=created&_owner=true&_bookings=true&limit=11`, {
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
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(`Error fetching venues: ${error}`)
	}
}
