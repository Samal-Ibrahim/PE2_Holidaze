import { LOGIN_API_URL } from "@/config/constants"
import type { LoginFail, LoginOk } from "@/types"
import { ApiError, apiCall } from "../apiClient"

export async function login(email: string, password: string): Promise<LoginOk | LoginFail> {
	try {
		const credential = {
			email: email,
			password: password,
		}

		const data = await apiCall<{
			data: { id: string; name: string; email: string; accessToken: string }
		}>(LOGIN_API_URL, {
			method: "POST",
			body: credential,
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
			errors: [{ message: "An unexpected error occurred during login" }],
		}
	}
}
