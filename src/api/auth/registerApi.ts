import { REGISTER_API_URL } from "@/config/constants"
import type { RegisterFail, RegisterOk, RegisterPayload } from "@/types"
import { ApiError, apiCall } from "../apiClient"

export async function register(payload: RegisterPayload): Promise<RegisterOk | RegisterFail> {
	try {
		const data = await apiCall<{ data: { name: string; email: string } }>(REGISTER_API_URL, {
			method: "POST",
			body: payload,
		})

		return { ok: true, user: data.data }
	} catch (error) {
		if (error instanceof ApiError) {
			return {
				ok: false,
				status: error.status,
				errors: error.errors,
			}
		}

		return {
			ok: false,
			status: 0,
			errors: [{ message: "An unexpected error occurred during registration" }],
		}
	}
}
