import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import fetchSingleVenue from "@/api/venues/fetchSingleVenue"

const ViewSingleVenue = () => {
	const { id } = useParams()

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venue", id],
		queryFn: () => fetchSingleVenue(id || ""),
		enabled: !!id,
	})

	if (isLoading) return <p>Loading...</p>
	if (isError) return <p>Error: {(error as Error).message}</p>

	const venue = data?.data

	if (!venue || Array.isArray(venue)) return <p>Venue not found</p>

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			<div className="grid lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Image Gallery */}
					{venue.media && venue.media.length > 0 && (
						<div className=" overflow-hidden">
							<img
								src={venue.media[0].url}
								alt={venue.media[0].alt || venue.name}
								className="w-full h-125 object-cover"
							/>
						</div>
					)}

					{/* Title and Rating */}
					<div>
						<h1 className="text-4xl font-bold mb-2">{venue.name}</h1>
						<div className="flex items-center gap-4 text-gray-600">
							<span className="flex items-center gap-1">
								<span className="text-yellow-500">★</span>
								<span className="font-semibold">{venue.rating}</span>
							</span>
							<span>•</span>
							<span>{venue.maxGuests} guests</span>
							{venue.location && (
								<>
									<span>•</span>
									<span>
										{venue.location.city}, {venue.location.country}
									</span>
								</>
							)}
						</div>
					</div>

					{/* Description */}
					<div className="border-t pt-6">
						<h2 className="text-2xl font-semibold mb-3">About this venue</h2>
						<p className="text-gray-700 leading-relaxed">{venue.description}</p>
					</div>

					{/* Amenities */}
					{venue.meta && (
						<div className="border-t pt-6">
							<h2 className="text-2xl font-semibold mb-4">Amenities</h2>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<span className="text-2xl">{venue.meta.wifi ? "✓" : "✗"}</span>
									<span className={venue.meta.wifi ? "text-gray-900" : "text-gray-400"}>WiFi</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">{venue.meta.parking ? "✓" : "✗"}</span>
									<span className={venue.meta.parking ? "text-gray-900" : "text-gray-400"}>
										Parking
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">{venue.meta.breakfast ? "✓" : "✗"}</span>
									<span className={venue.meta.breakfast ? "text-gray-900" : "text-gray-400"}>
										Breakfast
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">{venue.meta.pets ? "✓" : "✗"}</span>
									<span className={venue.meta.pets ? "text-gray-900" : "text-gray-400"}>
										Pets allowed
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Location */}
					{venue.location && (
						<div className="border-t pt-6">
							<h2 className="text-2xl font-semibold mb-3">Location</h2>
							<p className="text-gray-700">
								{venue.location.address && `${venue.location.address}, `}
								{venue.location.city && `${venue.location.city}, `}
								{venue.location.country}
							</p>
						</div>
					)}
				</div>

				{/* Booking Card */}
				<div className="lg:col-span-1">
					<div className="sticky top-8  p-6 bg-white">
						<div className="mb-6">
							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold">${venue.price}</span>
								<span className="text-gray-600">/ night</span>
							</div>
						</div>

						<div className="space-y-4 mb-6">
							<div>
								<label htmlFor="checkin" className="block text-sm font-semibold mb-2">
									Check-in
								</label>
								<input
									name="checkin"
									type="date"
									min={new Date().toISOString().split("T")[0]}
									className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-gray-500"
								/>
							</div>
							<div>
								<label htmlFor="checkout" className="block text-sm font-semibold mb-2">
									Check-out
								</label>
								<input
									type="date"
									name="checkout"
									min={new Date().toISOString().split("T")[0]}
									className="w-full px-4 py-3 border  focus:outline-none focus:ring-2 focus:ring-gray-500"
								/>
							</div>
							<div>
								<label htmlFor="guests" className="block text-sm font-semibold mb-2">
									Guests
								</label>
								<input
									type="number"
									name="guests"
									min="1"
									max={venue.maxGuests}
									defaultValue="1"
									className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-gray-500"
								/>
							</div>
						</div>

						<button
							type="button"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors"
						>
							Reserve
						</button>

						<p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>
					</div>
				</div>
			</div>
		</div>
	)
}
export default ViewSingleVenue
