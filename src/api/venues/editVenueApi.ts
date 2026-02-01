import { VENUES_ENDPOINT } from "@/config/constants"
import type { EditVenueRequest, EditVenueResponse } from "@/types/venue"
import { ApiError, apiCall, getStoredToken } from "../apiClient"

export async function editVenueApi(
	venueId: string,
	venueData: EditVenueRequest
): Promise<EditVenueResponse> {
	const token = getStoredToken()
	const apiKey = import.meta.env.VITE_API_KEY

	if (!token) {
		throw new Error("You must be logged in to edit a venue")
	}

	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		const data = await apiCall<{ data: EditVenueResponse }>(`${VENUES_ENDPOINT}/${venueId}`, {
			method: "PUT",
			body: venueData,
			token,
			apiKey,
		})

		return data.data
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to edit venue: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}

export async function deleteVenueApi(venueId: string): Promise<void> {
	const token = getStoredToken()
	const apiKey = import.meta.env.VITE_API_KEY

	if (!token) {
		throw new Error("You must be logged in to delete a venue")
	}

	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		await apiCall<{ data: null }>(`${VENUES_ENDPOINT}/${venueId}`, {
			method: "DELETE",
			token,
			apiKey,
		})
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to delete venue: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
