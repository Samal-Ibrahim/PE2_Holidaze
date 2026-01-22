import imgNA from "@/assets/img-NA.png"

import type { Venue } from "@/types/venue"
import type { RawVenues } from "@/types/venues"

export const normalizeSingleVenue = (venue: RawVenues): Venue => {
	return {
		id: venue.id,
		name: (venue.name ?? "").trim() === "" ? "Unnamed Venue" : venue.name,
		description:
			(venue.description ?? "").trim() === "" ? "No description available" : venue.description,
		media: (venue.media && venue.media.length > 0
			? [venue.media[0]]
			: [{ url: imgNA, alt: "Image not available" }]) as [{ url: string; alt: string }],
		price: venue.price ?? 0,
		maxGuests: venue.maxGuests ?? 1,
		rating: venue.rating ?? 0,
		created: venue.created ?? new Date().toISOString(),
		updated: venue.updated ?? new Date().toISOString(),
		meta: {
			wifi: venue.meta?.wifi ?? false,
			parking: venue.meta?.parking ?? false,
			breakfast: venue.meta?.breakfast ?? false,
			pets: venue.meta?.pets ?? false,
		},
		location: {
			...venue.location,
			address:
				(venue.location.address ?? "").trim() === ""
					? "No address available"
					: venue.location.address,
			city: (venue.location.city ?? "").trim() === "" ? "N/A" : venue.location.city,
			continent: (venue.location.continent ?? "").trim() === "" ? "N/A" : venue.location.continent,
			country: (venue.location.country ?? "").trim() === "" ? "N/A" : venue.location.country,
			lat: venue.location.lat ?? 0,
			lng: venue.location.lng ?? 0,
			zip: (venue.location.zip ?? "").trim() === "" ? "N/A" : venue.location.zip,
		},
		owner: venue.owner,
		bookings: (venue.bookings ?? []).map((b) => ({
			id: b.id,
			dateFrom: b.dateFrom,
			dateTo: b.dateTo,
			guests: b.guests ?? 1,
			created: b.created ?? new Date().toISOString(),
			updated: b.updated ?? new Date().toISOString(),
			customer: {
				name: b.customer?.name ?? "Unknown",
				email: b.customer?.email ?? "",
				bio: b.customer?.bio ?? "",
				avatar: {
					url: b.customer?.avatar?.url ?? imgNA,
					alt: b.customer?.avatar?.alt ?? "Avatar",
				},
				banner: {
					url: b.customer?.banner?.url ?? imgNA,
					alt: b.customer?.banner?.alt ?? "Banner",
				},
			},
		})),

		_count: venue._count,
	}
}
