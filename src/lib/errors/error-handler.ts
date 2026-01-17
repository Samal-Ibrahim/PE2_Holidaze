import { toast } from "react-toastify"

// Show error message as toast notification
export const handleError = (error: unknown): void => {
	if (error instanceof Error) {
		toast.error(error.message)
	} else {
		toast.error("Something went wrong")
	}
}

// Get error message from error object
export const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message
	}
	return "Something went wrong"
}
