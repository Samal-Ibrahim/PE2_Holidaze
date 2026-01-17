import { useQuery } from "@tanstack/react-query"
import fetchVenues from "@/api/venues/fetchVenues"
import Input from "@/components/Inputs/Input"
import type { Venue } from "@/types/venue"

const Venues = () => {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venues"],
		queryFn: () => fetchVenues(),
	})

	if (isLoading) return <p>Loading venues...</p>
	if (isError) return <p>Error: {(error as Error).message}</p>

	console.log("Venues data:", data)
	const venuesList = data?.data
	console.log("Fetched venues:", venuesList)
	return (
		<section className="flex flex-col gap-4 h-full bg-green-200">
			<Input inputId="search-venues" placeholder="Type to search..." />
			<div className="grid lg:grid-cols-[auto_1fr] gap-4 bg-red-200 h-full">
				<div className="bg-blue-100 p-4 w-60 h-full 2xs:hidden lg:block">
					<div className="h-full">
						<h5 className="font-bold mb-4">Filter</h5>
					</div>
				</div>
				<div className="p-4 h-full bg-blue-200">
					{venuesList && venuesList.length > 0 ? (
						<div className="grid grid-cols-1 grid-rows-auto gap-4 ">

							{venuesList.map((venue: Venue) => (
								<div key={venue.id} className="p-4 bg-green-200 shadow flex md:flex-row 2xs:flex-col items-start gap-2 w-full">
									<div className="bg-amber-200 shrink-0">
										<img
											src={venue.media[0]?.url}
											alt={venue.name}
											className="object-cover 2xs:w-full md:w-60 h-60"
										/>
									</div>
									<div className="flex flex-col  ">
										<h4 className="line-clamp-2">{venue.name}</h4>
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
