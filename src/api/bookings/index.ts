import { BOOKINGS_API_URL } from "@/config/constants"
import { ApiError, apiCall, getStoredToken } from "../apiClient"

interface CreateReservationPayload {
	dateFrom: string
	dateTo: string
	guests: number
	venueId: string
}

export async function createReservation(
	venueId: string,
	dateFrom: string,
	dateTo: string,
	guests: number
): Promise<{ data: { id: string } }> {
	const token = getStoredToken()
	const apiKey = import.meta.env.VITE_API_KEY

	if (!token) {
		throw new Error("You must be logged in to create a reservation")
	}

	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		const payload: CreateReservationPayload = {
			dateFrom,
			dateTo,
			guests,
			venueId,
		}

		const data = await apiCall<{ data: { id: string } }>(BOOKINGS_API_URL, {
			method: "POST",
			body: payload,
			token,
			apiKey,
		})

		return data
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(
				`Failed to create reservation: ${error.errors[0]?.message || "Unknown error"}`
			)
		}
		throw error
	}
}
