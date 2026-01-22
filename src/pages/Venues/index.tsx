import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { FaPerson } from "react-icons/fa6"
import { Link } from "react-router-dom"
import fetchVenues from "@/api/venues/fetchVenues"
import Input from "@/components/Inputs/Input"
import StarRating from "@/components/RatingStars"
import CardsSkeleton from "@/components/Skeleton/CardsSkeleton"
import type { Venue } from "@/types/venue"
import AmenitiesFilter from "./utils/AmenitiesFilter"
import CityFilter from "./utils/CityFilter"
import PriceFilter from "./utils/PriceFilter"
import RatingFilter from "./utils/RatingFilter"
import SortFilter from "./utils/SortFilter"

const Venues = () => {
	// Filters states
	const [searchQuery, setSearchQuery] = useState("")
	const [currentPage, setPage] = useState(1)
	const [priceRange, setPriceRange] = useState<number>(1000)
	const [ratingFilter, setRatingFilter] = useState<number[]>([])
	const [selectedCities, setSelectedCities] = useState<string[]>([])
	const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([])
	const [sortOption, setSortOption] = useState<string>("latest")

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venues"],
		queryFn: () => fetchVenues(),
	})

	const venues = data?.data ?? []

	const filteredVenues = venues.filter((venue: Venue) => {
		const searchTerm = searchQuery.toLowerCase()
		const matchesSearch =
			venue.name.toLowerCase().includes(searchTerm) ||
			venue.location?.address?.toLowerCase().includes(searchTerm) ||
			venue.location?.city?.toLowerCase().includes(searchTerm) ||
			venue.location?.country?.toLowerCase().includes(searchTerm) ||
			venue.description?.toLowerCase().includes(searchTerm)

		const locationMatch =
			selectedCities.length === 0 ||
			(venue.location?.city && selectedCities.includes(venue.location?.city?.toLowerCase()))

		const ratingMatch = ratingFilter.length === 0 || ratingFilter.includes(venue.rating)

		const amenitiesMatch = amenitiesFilter.every(
			(amenity) => venue.meta?.[amenity as keyof typeof venue.meta] === true
		)

		const priceMatch = priceRange >= venue.price

		return matchesSearch && locationMatch && ratingMatch && amenitiesMatch && priceMatch
	})

	const sortedVenues = useMemo(() => {
		const sorted = [...filteredVenues]

		switch (sortOption) {
			case "latest":
				return sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
			case "oldest":
				return sorted.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
			case "cheapest":
				return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
			case "expensive":
				return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
			default:
				return sorted
		}
	}, [filteredVenues, sortOption])

	const displayedVenues = sortedVenues.slice((currentPage - 1) * 12, currentPage * 12)

	if (isLoading) return <CardsSkeleton />
	if (isError) return <p>Error: {(error as Error).message}</p>

	return (
		<section className="flex flex-col gap-4 h-full">
			<Input
				inputId="search-venues"
				placeholder="Type to search..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<div className="grid lg:grid-cols-[auto_1fr] gap-4 h-full shadow-md">
				<div className="  w-60 h-full 2xs:hidden lg:block">
					<div
						className="h-full bg-gray-50
					 p-2 shadow"
					>
						<h5 className="font-bold mb-4">Filter</h5>
						<div className="flex flex-col gap-4">
							{/* Sort */}
							<SortFilter sortOption={sortOption} onSortChange={setSortOption} />{" "}
							<CityFilter
								selectedCities={selectedCities}
								onCityChange={setSelectedCities}
								venues={venues}
							/>
							<AmenitiesFilter
								amenitiesFilter={amenitiesFilter}
								setAmenitiesFilter={setAmenitiesFilter}
							/>
							<PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
							<RatingFilter ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} />
						</div>
					</div>
				</div>
				<div>
					{displayedVenues && displayedVenues.length > 0 ? (
						<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
							{displayedVenues.map((venue: Venue) => (
								<Link key={venue.id} to={`/venues/${venue.id}`} className="card block">
									<div className="shrink-0 w-full h-48 overflow-hidden">
										<img
											src={venue.media[0]?.url}
											alt={venue.name}
											className="object-cover shrink-0 w-full h-full "
										/>
									</div>
									<div className="flex flex-col gap-2 w-full h-full ">
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
								</Link>
							))}
						</div>
					) : (
						<div className="bg-gray-50 w-full h-full flex justify-center items-center">
							<p>No venues, please try a different search.</p>
						</div>
					)}
				</div>
			</div>
			<div className="bg-gray-50 container flex flex-col items-center p-4">
				{filteredVenues.length > 12 && (
					<p>
						Showing {displayedVenues.length} of {filteredVenues.length} venues.
					</p>
				)}
				<div className="flex flex-row justify-between max-w-md  p-2 w-full mt-4">
					<button
						type="button"
						onClick={() => setPage(currentPage > 1 ? currentPage - 1 : 1)}
						className="btn"
					>
						<FaArrowLeft />
					</button>

					<div>
						Page {currentPage} of {Math.ceil(filteredVenues.length / 12)}
					</div>

					<button
						type="button"
						onClick={() =>
							setPage(
								currentPage < Math.ceil(filteredVenues.length / 12) ? currentPage + 1 : currentPage
							)
						}
						className="btn"
					>
						<FaArrowRight />
					</button>
				</div>
			</div>
		</section>
	)
}

export default Venues
