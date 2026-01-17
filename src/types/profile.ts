import type { Media } from "./user"

export type ProfileUpdatePayload = {
	avatar: Media
	banner: Media
	bio: string
	venueManager: boolean
}
