const ALLOWED_DOMAIN = "stud.noroff.no"

export const isValidStudentEmail = (email: string): boolean => {
	const normalized = email.trim().toLowerCase()
	const match = normalized.match(/^[^@\s]+@([^@\s]+)$/)

	if (!match) return false
	return match[1] === ALLOWED_DOMAIN
}
