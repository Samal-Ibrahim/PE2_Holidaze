import type { ApiFail, ApiSuccess } from "./api"

export type LoginResponse = {
	name: string
	email: string
	accessToken: string
	id: string
}

export type LoginOk = ApiSuccess<{ user: LoginResponse }>

export type LoginFail = ApiFail

export type RegisterPayload = {
	name: string
	email: string
	password: string
	bio?: string
	avatar?: {
		url: string
		alt: string
	}
	banner?: {
		url: string
		alt: string
	}
	venueManager?: boolean
}

export type RegisterResponse = {
	name: string
	email: string
}

export type RegisterOk = ApiSuccess<{ user: RegisterResponse }>

export type RegisterFail = ApiFail
