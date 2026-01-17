const MIN_PASSWORD_LENGTH = 8

export const isValidPassword = (password: string): boolean => {
	return password.length >= MIN_PASSWORD_LENGTH
}
