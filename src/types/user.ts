export type User = {
	id: string
	name: string
	avatar?: {
		url: string
		alt: string
	}
	email: string
	token: string
}

export type Media = {
	url: string
	alt: string
}

export type ProfileProps = {
	name: string
	email: string
	avatar: Media
	banner: Media
	bio: string
	venueManager: boolean
	_count: {
		bookings: number
		venues: number
	}
	venues?: {
		id: string
		created: string
		description: string
		location: {
			address: string
			city: string
			country: string
			zipCode: string
			continent: string
			lat: number
			lng: number
			zip: string
		}
		maxGuests: number
		price: number
		rating: number
		name: string
		updated: string
		media: {
			url: string
			alt: string
		}[]
		meta: {
			wifi: boolean
			parking: boolean
			breakfast: boolean
			pets: boolean
		}
	}[]
	bookings?: {
		id: string
		created: string
		dateFrom: string
		dateTo: string
		guests: number
		venue: {
			id: string
			created: string
			description: string
			location: {
				address: string
				city: string
				country: string
				zipCode: string
				continent: string
				lat: number
				lng: number
				zip: string
			}
			maxGuests: number
			price: number
			rating: number
			name: string
			updated: string
			media: {
				url: string
				alt: string
			}[]
			meta: {
				wifi: boolean
				parking: boolean
				breakfast: boolean
				pets: boolean
			}
		}
		updated: string
	}[]
}
