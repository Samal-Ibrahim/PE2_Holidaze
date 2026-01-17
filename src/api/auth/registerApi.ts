import { REGISTER_API_URL } from "@/config/constants"
import type { RegisterFail, RegisterOk, RegisterPayload } from "@/types"

export default async function registerApi(
	payload: RegisterPayload
): Promise<RegisterOk | RegisterFail> {
	try {
		const response = await fetch(REGISTER_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		})

		const raw = await response.json().catch(() => null)

		if (!response.ok) {
			return {
				ok: false,
				status: response.status,
				errors: raw?.errors ?? [{ message: "Registration failed" }],
			}
		}

		return { ok: true, user: raw.data }
	} catch {
		return {
			ok: false,
			status: 0,
			errors: [{ message: "Network error. Please try again." }],
		}
	}
}
