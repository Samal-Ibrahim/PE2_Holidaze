import type { LoginFail, LoginOk } from "@/types"
import { LOGIN_API_URL } from "../../config/constants"

export default async function loginApi(
	email: string,
	password: string
): Promise<LoginOk | LoginFail> {
	const credential = {
		email: email,
		password: password,
	}
	try {
		const response = await fetch(LOGIN_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credential),
		})

		const raw = await response.json().catch(() => null)
		if (!response.ok) {
			return {
				ok: false,
				status: response.status,
				errors: raw?.errors ?? [{ message: "Invalid email or password" }],
			}
		}
		return { ok: true, user: raw.data }
	} catch {
		return {
			ok: false,
			status: 0,
			errors: [{ message: "Network error. Try again." }],
		}
	}
}
