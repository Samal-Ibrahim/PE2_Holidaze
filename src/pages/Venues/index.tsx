import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
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
	const [isFilterOpen, setFilterOpen] = useState<boolean>(false)
	useEffect(() => {
		if (isFilterOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}

		return () => {
			document.body.style.overflow = ""
		}
	}, [isFilterOpen])

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
			<div className="gap-4 grid lg:grid-cols-[auto_1fr] shadow-md h-full">
				<aside
					className={`2xs:fixed lg:static flex lg:w-60 2xs:w-full  left-0 bottom-0 p-2 2xs:overflow-y-scroll lg:h-full lg:overflow-hidden justify-center hide-scrollbar lg:bg-gray-50 ${isFilterOpen ? "max-h-screen pt-10 bg-black/35 scroll-none" : "h-14 bg-black/15"}`}
				>
					<div className="lg:hidden 2xs:fixed flex justify-center w-full ">
						<button
							type="button"
							onClick={() => {
								setFilterOpen(!isFilterOpen)
							}}
							className={`bg-gray-50 shadow px-4 py-2 cursor-pointer active:bg-gray ${isFilterOpen ? "mt-6" : ""}`}
						>
							Filter
						</button>
					</div>

					<div
						className={`2xs:w-full md:w-md h-full bg-gray-50 p-4 lg:block ${isFilterOpen ? "block" : "hidden"}`}
					>
						<h5 className="mb-6 font-bold">Sorting by</h5>
						<div className="flex flex-col gap-4">
							{/* Sort */}
							<SortFilter sortOption={sortOption} onSortChange={setSortOption} />
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
				</aside>
				<div>
					{displayedVenues && displayedVenues.length > 0 ? (
						<div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
							{displayedVenues.map((venue: Venue) => (
								<Link key={venue.id} to={`/venues/${venue.id}`} className="block card">
									<div className="w-full h-48 overflow-hidden shrink-0">
										<img
											src={venue.media[0]?.url}
											alt={venue.name}
											className="w-full h-full object-cover shrink-0"
										/>
									</div>
									<div className="flex flex-col gap-2 w-full h-full">
										<div className="flex flex-row justify-between">
											<div className="w-50">
												<h5 className="truncate line-clamp-2">{venue.name}</h5>
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
						<div className="flex justify-center items-center bg-gray-50 w-full h-full">
							<p>No venues, please try a different search.</p>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col items-center bg-gray-50 p-4 container">
				{filteredVenues.length > 12 && (
					<p>
						Showing {displayedVenues.length} of {filteredVenues.length} venues.
					</p>
				)}
				<div className="flex flex-row justify-between mt-4 p-2 w-full max-w-md">
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
