export class AuthenticationError extends Error {
	constructor(message = "Authentication required") {
		super(message)
		this.name = "AuthenticationError"
	}
}

export class ValidationError extends Error {
	constructor(message = "Validation failed") {
		super(message)
		this.name = "ValidationError"
	}
}
