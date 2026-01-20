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

export class ApiError extends Error {
	constructor(message = "API request failed") {
		super(message)
		this.name = "ApiError"
	}
}
