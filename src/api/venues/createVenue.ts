import { VENUES_ENDPOINT } from "@/config/constants"
import type { MediaItem, Venue, VenueLocation, VenueMeta } from "@/types/venue"
import { ApiError, apiCall, getStoredToken } from "../apiClient"

export type CreateVenueRequest = {
	name: string
	description: string
	media: MediaItem[]
	price: number
	maxGuests: number
	rating?: number
	meta: VenueMeta
	location: VenueLocation
}

export type CreateVenueResponse = Venue

export async function createVenueApi(venueData: CreateVenueRequest): Promise<CreateVenueResponse> {
	const token = getStoredToken()
	const apiKey = import.meta.env.VITE_API_KEY
	if (!token) {
		throw new Error("You must be logged in to create a venue")
	}
	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		const data = await apiCall<{ data: CreateVenueResponse }>(VENUES_ENDPOINT, {
			method: "POST",
			body: venueData,
			token,
			apiKey,
		})
		return data.data
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to create venue: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
