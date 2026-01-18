import { useQuery } from "@tanstack/react-query"
import { FaPerson } from "react-icons/fa6"
import fetchVenues from "@/api/venues/fetchVenues"
import Input from "@/components/Inputs/Input"
import StarRating from "@/components/RatingStars"
import type { Venue } from "@/types/venue"

const Venues = () => {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venues"],
		queryFn: () => fetchVenues(),
	})

	if (isLoading) return <p>Loading venues...</p>
	if (isError) return <p>Error: {(error as Error).message}</p>

	const venues = data?.data ?? []

	return (
		<section className="flex flex-col gap-4 h-full">
			<Input inputId="search-venues" placeholder="Type to search..." />
			<div className="grid lg:grid-cols-[auto_1fr] gap-4 bg-red-200 h-full">
				<div className="bg-blue-100 p-4 w-60 h-full 2xs:hidden lg:block">
					<div className="h-full">
						<h5 className="font-bold mb-4">Filter</h5>
					</div>
				</div>
				<div className="p-4 h-full  bg-blue-200">
					{venues && venues.length > 0 ? (
						<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 ">
							{venues.map((venue: Venue) => (
								<div key={venue.id} className="p-4 bg-green-200 shadow flex flex-col gap-4 w-full">
									<div className="bg-amber-200 shrink-0 w-full h-48 overflow-hidden">
										<img
											src={venue.media[0]?.url}
											alt={venue.name}
											className="object-cover shrink-0 w-full h-full "
										/>
									</div>
									<div className="flex flex-col gap-2 bg-yellow-100 w-full h-full ">
										<div className="flex flex-row justify-between">
											<div className="w-50">
												<h5 className="line-clamp-2 truncate">{venue.name}</h5>
											</div>
											<StarRating rating={venue.rating} />
										</div>
										<div>
											<p>{venue.location?.address ?? "No address available"}</p>
										</div>
										<div className="flex flex-row justify-between">
											<p className="text-sm">Night / ${venue.price}</p>
											<div className="flex items-center gap-1">
												<FaPerson />
												<p className="text-sm">{venue.maxGuests}</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p>No venues available.</p>
					)}
				</div>
			</div>
		</section>
	)
}

export default Venues
