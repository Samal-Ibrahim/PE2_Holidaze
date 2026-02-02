import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import "react-day-picker/dist/style.css"
import { createReservation } from "@/api/bookings"
import { fetchSingleVenue } from "@/api/venues/fetchSingleVenue"
import { useAuth } from "@/hooks/useAuth"

const ViewSingleVenue = () => {
	const { id } = useParams()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
	const [guests, setGuests] = useState(1)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const datePickerRef = useRef<HTMLDivElement>(null)

	// Close date picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
				setShowDatePicker(false)
			}
		}

		if (showDatePicker) {
			document.addEventListener("mousedown", handleClickOutside)
			return () => document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [showDatePicker])

	const { user: loggedInUser } = useAuth()
	const username = loggedInUser?.name

	const isUserLoggedIn = !!loggedInUser

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venue", id],
		queryFn: () => fetchSingleVenue(id || ""),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})

	// Get all booked dates from venue Bookings for disabling in date picker
	const bookedDatesSet = useMemo(() => {
		if (!data?.data?.bookings || data.data.bookings.length === 0) return new Set<string>()

		const bookedDates = new Set<string>()

		data.data.bookings.forEach((booking) => {
			// Parse ISO strings to get just the date part (YYYY-MM-DD)
			const startDateStr = booking.dateFrom.split("T")[0]
			const endDateStr = booking.dateTo.split("T")[0]

			const start = new Date(startDateStr)
			const end = new Date(endDateStr)

			// Add all dates in the range to the set, including end date
			for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
				bookedDates.add(date.toISOString().split("T")[0])
			}
		})

		return bookedDates
	}, [data?.data?.bookings])

	const getBookedDates = () => {
		return bookedDatesSet
	}

	const isDateBooked = (dateStr: string) => {
		return getBookedDates().has(dateStr)
	}

	const toZulu = (date: string) => {
		if (!date) throw new Error("Please select both dates.")
		// Convert date string to ISO 8601 format with Z (UTC) timezone for API
		return new Date(`${date}T00:00:00.000Z`).toISOString()
	}
	const qc = useQueryClient()
	const reservationData = () => {
		if (!dateRange.from || !dateRange.to) {
			throw new Error("Please select both check-in and check-out dates.")
		}

		const dateFromRaw = dateRange.from.toISOString().split("T")[0]
		const dateToRaw = dateRange.to.toISOString().split("T")[0]

		return {
			dateFrom: toZulu(dateFromRaw),
			dateTo: toZulu(dateToRaw),
			guests,
		}
	}

	const mutation = useMutation({
		mutationFn: (bookingData: {
			venueId: string
			dateFrom: string
			dateTo: string
			guests: number
		}) =>
			createReservation(
				bookingData.venueId,
				bookingData.dateFrom,
				bookingData.dateTo,
				bookingData.guests
			),

		onSuccess: () => {
			toast.success("Reservation created successfully!")
			qc.invalidateQueries({ queryKey: ["profile", username] })
		},
		onError: (err: unknown) =>
			toast.error(err instanceof Error ? err.message : "Failed to create reservation"),
	})
	if (isLoading) return <p>Loading venue details...</p>
	if (isError) return <p>Error loading venue: {(error as Error).message}</p>

	const venue = data?.data

	if (!venue || Array.isArray(venue)) return <p>Venue not found</p>

	const reserveBooking = () => {
		if (isUserLoggedIn) {
			return (
				<>
					<button
						type="button"
						onClick={() => {
							try {
								const { dateFrom, dateTo, guests } = reservationData()
								mutation.mutate({ venueId: id || "", dateFrom, dateTo, guests })
							} catch (e) {
								toast.error((e as Error).message)
							}
						}}
						className="w-full py-3 font-semibold text-btn-text transition-colors bg-btn hover:bg-btn-bg-hover cursor-pointer"
					>
						{mutation.isPending ? "Reserving..." : "Reserve"}
					</button>
					<p>{mutation.isError ? "Failed to create reservation." : ""}</p>
				</>
			)
		} else {
			return (
				<p className="text-center text-sm text-gray-500 mt-4">
					Please log in to make a reservation.
				</p>
			)
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			<div className="grid lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Image Gallery */}
					{venue.media && venue.media.length > 0 && (
						<div className="relative">
							<div className="overflow-hidden">
								<img
									src={venue.media[currentImageIndex].url}
									alt={venue.media[currentImageIndex].alt || venue.name}
									className="w-full lg:h-140 md:h-120 2xs:h-80 object-cover"
								/>
							</div>
							{venue.media.length > 1 && (
								<>
									<button
										type="button"
										onClick={() => {
											setCurrentImageIndex((prev) =>
												prev === 0 ? venue.media.length - 1 : prev - 1
											)
										}}
										className="absolute left-4 top-1/2 p-2 -translate-y-1/2 bg-white/80 shadow-lg hover:bg-white"
									>
										←
									</button>
									<button
										type="button"
										onClick={() => {
											setCurrentImageIndex((prev) =>
												prev === venue.media.length - 1 ? 0 : prev + 1
											)
										}}
										className="absolute right-4 top-1/2 p-2 -translate-y-1/2 bg-white/80 shadow-lg hover:bg-white"
									>
										→
									</button>
								</>
							)}
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
						<p className="text-gray-700 leading-relaxed p-2">{venue.description}</p>
						<div className="border-t pt-6">
							<h2 className="text-2xl font-semibold mb-3">Host Information</h2>
							<div className="flex flex-row gap-4 items-center">
								<div>
									<img
										src={venue.owner?.avatar?.url}
										alt={venue.owner?.avatar?.alt || "Owner avatar"}
										className="w-20 h-20 rounded-full object-cover mb-4"
									/>
								</div>
								<div className="flex flex-col gap-2">
									<p> {venue.owner.name || "Unknown"}</p>
									<p> {venue.owner.email || "Unknown"}</p>
								</div>
							</div>
						</div>
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
					<div className="sticky top-8 p-6 bg-white z-10 overflow-visible">
						<div className="mb-6">
							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold">${venue.price}</span>
								<span className="text-gray-600">/ night</span>
							</div>
						</div>

						<div className="space-y-4 mb-6">
							<div className="relative">
								<label htmlFor="dates-btn" className="block text-sm font-semibold mb-2">
									Select Dates
								</label>
								<button
									id="dates-btn"
									type="button"
									onClick={() => setShowDatePicker(!showDatePicker)}
									className="w-full px-4 py-3 border text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
								>
									{dateRange.from && dateRange.to
										? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
										: dateRange.from
											? `From ${dateRange.from.toLocaleDateString()}`
											: "Select dates"}
								</button>
								{showDatePicker && (
									<div
										ref={datePickerRef}
										className="absolute mt-1 border p-4 bg-white shadow-lg rounded max-h-96 overflow-y-auto z-50"
									>
										<DayPicker
											mode="range"
											selected={
												dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined
											}
											onSelect={(range) => {
												setDateRange(range || {})
											}}
											disabled={(date) => {
												const dateStr = date.toISOString().split("T")[0]
												const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
												const isBooked = isDateBooked(dateStr)

												return isPast || isBooked
											}}
										/>
									</div>
								)}
							</div>
							<div>
								<label htmlFor="guests" className="block text-sm font-semibold mb-2">
									Guests
								</label>
								<input
									type="number"
									id="guests"
									name="guests"
									min="1"
									max={venue.maxGuests}
									value={guests}
									onChange={(e) =>
										setGuests(Math.max(1, Math.min(venue.maxGuests, Number(e.target.value))))
									}
									className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-gray-500"
								/>
							</div>
						</div>
						{reserveBooking()}
						<p className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</p>
					</div>
				</div>
			</div>
		</div>
	)
}
export default ViewSingleVenue
