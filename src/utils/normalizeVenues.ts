import imgNA from "@/assets/img-NA.png"
import type { RawVenues, Venues } from "@/types/venues"

// function to make the venue data consistent and clean on display

export const normalizeVenues = (venues: RawVenues[]): Venues[] => {
	const normalizedVenues = venues.map((venue) => {
		return {
			...venue,
			name: (venue.name ?? "").trim() === "" ? "Unnamed Venue" : venue.name,
			description:
				(venue.description ?? "").trim() === "" ? "No description available" : venue.description,
			// Only include first image for list view to reduce payload
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
				continent:
					(venue.location.continent ?? "").trim() === "" ? "N/A" : venue.location.continent,
				country: (venue.location.country ?? "").trim() === "" ? "N/A" : venue.location.country,
				lat: venue.location.lat ?? 0,
				lng: venue.location.lng ?? 0,
				zip: (venue.location.zip ?? "").trim() === "" ? "N/A" : venue.location.zip,
			},
		}
	})
	return normalizedVenues
}
