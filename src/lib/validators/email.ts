const ALLOWED_DOMAIN = "stud.noroff.no"

export const isValidStudentEmail = (email: string): boolean => {
	const normalized = email.trim().toLowerCase()
	// Extract domain part using regex: matches anything before @ and everything after
	const match = normalized.match(/^[^@\s]+@([^@\s]+)$/)

	if (!match) return false
	return match[1] === ALLOWED_DOMAIN
}
