export type ApiError = {
	message: string
}

export type ApiResponse<T> = {
	data: T
	meta?: Record<string, unknown>
}

export type ApiSuccess<T> = {
	ok: true
} & T

export type ApiFail = {
	ok: false
	status: number
	errors: ApiError[]
}
