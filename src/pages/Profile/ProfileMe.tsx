import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import userProfile from "@/api/profiles/holidazeProfile"
import { useEditToggle } from "@/context/EditToggleContext"
import { useAuth } from "@/hooks/useAuth"
import type { Profile } from "@/types"
import EditProfile from "./components/EditProfile"

type Tab = "bookings" | "venues"

const ProfileMe = () => {
	const { user } = useAuth()
	const username = user?.name

	const [isActiveTab, setActiveTab] = useState<Tab>("bookings")
	const { isEditOpen, setEditOpen } = useEditToggle()

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["profile", username],
		queryFn: () => userProfile(username as string),
		enabled: !!username,
		staleTime: 5 * 60 * 1000,
	})

	if (!username) return <p>Not logged in</p>
	if (isLoading) return <p>Loading profile...</p>
	if (isError) return <p>{(error as Error).message}</p>

	const profileDetails = data?.data as Profile

	const isVenueManager = () => {
		const venueManager = profileDetails.venueManager
		if (venueManager) {
			return (
				<h5 className="text-white! bg-blue-900 px-2 py-1 text-sm font-semibold">Venue Manager</h5>
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
						<div className="p-2 h-64">
							<img
								src={profileDetails.avatar.url}
								alt={profileDetails.avatar.alt}
								className="w-full h-full bg-white object-cover shadow-lg p-4"
							/>
						</div>
						<div className="h-full flex flex-row gap-4 justify-end">
							<h1 className="text-white! text-[3rem]! font-bold">{profileDetails.name}</h1>
							<div className="flex items-center ">{isVenueManager()}</div>
						</div>
					</div>
					<div className="absolute top-8 right-8 ">
						<button
							type="button"
							className="cursor-pointer bg-white hover:bg-gray-200 px-2 py-1 shadow-xl"
							onClick={() => setEditOpen(true)}
						>
							Edit
						</button>
					</div>
					<div
						className={`fixed top-0 right-0 flex items-center justify-center h-full ${isEditOpen ? "flex" : "hidden"} w-full bg-black/60`}
					>
						<EditProfile data={profileDetails} />
					</div>
				</div>
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
							<div>
								{profileDetails.bookings?.map((booking) => (
									<div key={booking.id} className="border p-4 mb-4 flex flex-row gap-4 ">
										<div>
											<img
												src={booking.venue?.media[0]?.url}
												alt={booking.venue?.media[0]?.alt || "Booking Image"}
												className="w-40"
											/>
										</div>
										<div>
											<h4 className="text-xl font-bold mb-2">{booking.venue?.name}</h4>
											<p>
												<strong>Booking ID:</strong> {booking.id}
											</p>
											<p>
												<strong>Date From:</strong>
												{new Date(booking.dateFrom).toLocaleDateString()}
											</p>
											<p>
												<strong>Date To:</strong> {new Date(booking.dateTo).toLocaleDateString()}
											</p>
											<p>
												<strong>Guests:</strong> {booking.guests}
											</p>
											<p>
												<strong>Booked On:</strong> {new Date(booking.created).toLocaleDateString()}
											</p>
											<p>
												<strong>Venue Location:</strong> {booking.venue?.location.address},
												{booking.venue?.location.city}, {booking.venue?.location.country}
											</p>
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
							<div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{" "}
								{profileDetails.venues?.map((venue) => (
									<div
										key={venue.id}
										className="bg-white shadow-sm hover:shadow-md transition-shadow"
									>
										<img
											src={venue.media?.[0]?.url}
											alt={venue.media?.[0]?.alt || "Venue image"}
											className="h-44 w-full object-cover"
										/>

										<div className="p-4">
											<h4 className="text-lg font-semibold leading-tight">{venue.name}</h4>
											<p className="mt-1 text-sm text-neutral-600 line-clamp-2">
												{venue.description}
											</p>

											<div className="mt-3 space-y-1 text-sm text-neutral-700">
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

											{/* manager actions (optional now) */}
											<div className="mt-4 flex gap-2">
												<button
													type="button"
													className="flex-1 bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
												>
													View
												</button>
												<button
													type="button"
													className="px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200"
												>
													Edit
												</button>
											</div>
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
export default ProfileMe
