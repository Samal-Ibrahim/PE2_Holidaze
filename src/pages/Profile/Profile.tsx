import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { cancelBooking } from "@/api/bookings"
import { fetchProfile } from "@/api/profiles/holidazeProfileApi"
import { PROFILE_PAGE_URL } from "@/config/constants"
import { useAuth } from "@/hooks/useAuth"
import type { ProfileProps } from "@/types"

type Tab = "bookings" | "venues"

const Profile = () => {
	const location = useLocation()

	const { user } = useAuth()
	const username = user?.name

	const [isActiveTab, setActiveTab] = useState<Tab>("bookings")

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["profile", username],
		queryFn: () => fetchProfile(username as string),
		enabled: !!username,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})
	const qc = useQueryClient()

	if (!username) return <p>Not logged in</p>
	if (isLoading) return <p>Loading profile...</p>
	if (isError) return <p>{(error as Error).message}</p>

	const profileDetails = data?.data as ProfileProps

	const isVenueManager = () => {
		const venueManager = profileDetails.venueManager
		if (venueManager) {
			return (
				<h6 className="text-white! bg-blue-900 px-2 py-1 text-sm font-semibold">Venue Manager</h6>
			)
		}
	}

	const baseTabClass = "cursor-pointer p-4 font-semibold text-gray-700 transition hover:bg-gray-100"
	const activeTabClass = "border-b-4 border-black/30 font-bold"

	return (
		<div className="bg-bg min-h-screen flex flex-col gap-2 shadow-lg">
			<div className="flex">
				<div className="relative w-full shadow-md p-4">
					<div className="relative w-full h-90 overflow-hidden">
						<img
							src={profileDetails.banner.url}
							alt={profileDetails.banner.alt}
							className="w-full h-full object-cover"
						/>
						<div
							className="absolute inset-x-0 bottom-0 h-24 
                  bg-linear-to-t from-black/80 via-black/40 to-transparent
                  pointer-events-none"
						/>
					</div>
					<div className="absolute bottom-6 left-6 flex items-end gap-4">
						<div className="p-2 md:h-64 2xs:h-32 2xs:p-0">
							<img
								src={profileDetails.avatar.url}
								alt={profileDetails.avatar.alt}
								className="w-full h-full bg-white object-cover shadow-lg md:p-4 2xs:p-2"
							/>
						</div>
						<div className="h-full flex flex-row gap-4 justify-end">
							<h1 className="text-white! md:text-[3rem]! 2xs:text-[2rem]! font-bold">
								{profileDetails.name}
							</h1>
						</div>
					</div>
					<div className="absolute top-8 right-8 flex flex-row gap-4">
						<div className="flex items-center ">{isVenueManager()}</div>
						<Link
							to={`${PROFILE_PAGE_URL}/edit-profile`}
							state={{ backgroundLocation: location }}
							className="cursor-pointer bg-white hover:bg-gray-200 px-2 py-1 shadow-xl"
						>
							Edit
						</Link>
					</div>
				</div>
			</div>
			<div>
				<p className="max-w-3xl mx-auto p-4 text-center text-gray-700">{profileDetails.bio}</p>
			</div>
			<div className="shadow-md p-4 w-full flex flex-row gap-4 justify-center items-center">
				<button
					type="button"
					onClick={() => setActiveTab("bookings")}
					className={`${baseTabClass} ${isActiveTab === "bookings" ? activeTabClass : ""}`}
				>
					<span className="font-bold">My Bookings</span>: {profileDetails._count.bookings}
				</button>
				<span>|</span>
				<button
					type="button"
					onClick={() => setActiveTab("venues")}
					className={`${baseTabClass} ${isActiveTab === "venues" ? activeTabClass : ""}`}
				>
					<span className="font-bold">My Venues</span>: {profileDetails._count.venues}
				</button>
			</div>
			<div className="p-4">
				{isActiveTab === "bookings" && (
					<div>
						{profileDetails.bookings?.length === 0 ? (
							<p>No bookings found.</p>
						) : (
							<div className=" grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{profileDetails.bookings?.map((booking) => (
									<div
										key={booking.id}
										className="flex flex-col justify-between bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
									>
										<div className="flex flex-col ">
											<img
												src={booking.venue.media?.[0]?.url}
												alt={booking.venue.media?.[0]?.alt || "Venue image"}
												className="h-44 w-full object-cover"
											/>
											<h4 className="text-lg font-semibold leading-tight">{booking.venue.name}</h4>
											<div className=" flex flex-col justify-between mt-3 space-y-1 text-sm text-neutral-700">
												<p className="truncate">
													<span className="font-semibold">Location:</span>{" "}
													{booking.venue.location?.address}, {booking.venue.location?.city}
												</p>

												<div className="flex items-center justify-between">
													<p>
														<span className="font-semibold">Price:</span> ${booking.venue.price}
														/night
													</p>
													<p>
														<span className="font-semibold">Guests:</span> {booking.venue.maxGuests}
													</p>
												</div>
											</div>
										</div>
										<div className="mt-4 flex gap-2">
											<Link
												key={booking.venue.id}
												to={`/venues/${booking.venue.id}`}
												className="flex-1 bg-btn px-3 py-2 text-sm text-white hover:bg-btn-bg-hover cursor-pointer"
											>
												View
											</Link>
											<button
												type="button"
												className="btn btn-danger"
												onClick={async () => {
													if (window.confirm("Are you sure you want to cancel this booking?")) {
														await cancelBooking(booking.id)
														toast.success("Booking cancelled successfully.")
														qc.invalidateQueries({ queryKey: ["profile"] })
														qc.invalidateQueries({ queryKey: ["venue"] })
													}
												}}
											>
												Cancel
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{isActiveTab === "venues" && (
					<div className="">
						{profileDetails.venues?.length === 0 ? (
							<p>No venues found.</p>
						) : (
							<div className=" grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{profileDetails.venues?.map((venue) => (
									<div
										key={venue.id}
										className="flex flex-col justify-between bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
									>
										<div className="flex flex-col ">
											<img
												src={venue.media?.[0]?.url}
												alt={venue.media?.[0]?.alt || "Venue image"}
												className="h-44 w-full object-cover"
											/>
											<h4 className="text-lg font-semibold leading-tight">{venue.name}</h4>

											<div className=" flex flex-col justify-between mt-3 space-y-1 text-sm text-neutral-700">
												<p className="truncate">
													<span className="font-semibold">Location:</span> {venue.location?.address}
													, {venue.location?.city}
												</p>

												<div className="flex items-center justify-between">
													<p>
														<span className="font-semibold">Price:</span> ${venue.price}/night
													</p>
													<p>
														<span className="font-semibold">Guests:</span> {venue.maxGuests}
													</p>
												</div>
											</div>
										</div>
										<div className="mt-4 flex gap-2">
											<Link
												key={venue.id}
												to={`/venues/${venue.id}`}
												className="flex-1 bg-btn px-3 py-2 text-sm text-white hover:bg-btn-bg-hover cursor-pointer"
											>
												View
											</Link>

											<Link
												to={`${PROFILE_PAGE_URL}/edit-venue/${venue.id}`}
												state={{ backgroundLocation: location }}
												className="px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
											>
												Edit
											</Link>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
export default Profile
