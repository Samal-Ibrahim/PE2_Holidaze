import { BOOKINGS_API_URL } from "@/config/constants"
import { ApiError, apiCall, getStoredToken } from "../apiClient"

export async function cancelBooking(bookingId: string): Promise<void> {
	const token = getStoredToken()
	const apiKey = import.meta.env.VITE_API_KEY

	if (!token) {
		throw new Error("You must be logged in to cancel a booking")
	}

	if (!apiKey) {
		throw new Error("API key is not configured. Please check your environment variables.")
	}

	try {
		const bookingUrl = `${BOOKINGS_API_URL}/${bookingId}`

		await apiCall<void>(bookingUrl, {
			method: "DELETE",
			token,
			apiKey,
		})
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(`Failed to cancel booking: ${error.errors[0]?.message || "Unknown error"}`)
		}
		throw error
	}
}
