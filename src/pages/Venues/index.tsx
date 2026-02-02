import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { FaPerson } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { fetchVenues } from "@/api/venues/fetchVenues"
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
	const [currentPage, setPage] = useState<number>(1)
	const [priceRange, setPriceRange] = useState<number>(10000)
	const [ratingFilter, setRatingFilter] = useState<number[]>([])
	const [selectedCities, setSelectedCities] = useState<string[]>([])
	const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([])
	const [sortOption, setSortOption] = useState<string>("latest")
	const [isFilterOpen, setFilterOpen] = useState<boolean>(false)

	useEffect(() => {
		// Only set overflow when filter is open
		if (isFilterOpen) {
			document.body.style.overflow = "hidden"
		}

		return () => {
			if (isFilterOpen) {
				document.body.style.overflow = ""
			}
		}
	}, [isFilterOpen])

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venues", currentPage],
		queryFn: () => fetchVenues(currentPage),
		staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
		gcTime: 10 * 60 * 1000,
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
			(venue.location?.city &&
				selectedCities.map((c) => c.toLowerCase()).includes(venue.location.city.toLowerCase()))

		const ratingMatch = ratingFilter.length === 0 || ratingFilter.includes(Math.round(venue.rating))

		const amenitiesMatch =
			amenitiesFilter.length === 0 ||
			amenitiesFilter.every((amenity) => venue.meta?.[amenity as keyof Venue["meta"]] === true)

		const priceMatch = (venue.price ?? 0) <= priceRange

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

	if (isLoading && sortedVenues.length === 0) return <CardsSkeleton />

	// Show error message
	if (isError) {
		return (
			<section className="flex flex-col gap-4 items-center justify-center p-4">
				<p className="text-red-600 font-semibold">Error loading venues</p>
				<p className="text-gray-600">{(error as Error).message}</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Reload Page
				</button>
			</section>
		)
	}

	return (
		<section className="flex flex-col gap-4 h-full">
			<Input
				inputId="search-venues"
				placeholder="Type to search..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<div className="gap-4 grid lg:grid-cols-[280px_1fr]">
				{/* Mobile Filter Toggle Button */}
				<div className="lg:hidden flex justify-center py-2">
					<button
						type="button"
						onClick={() => setFilterOpen(!isFilterOpen)}
						className="w-full px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
					>
						{isFilterOpen ? "Hide Filters" : "Show Filters"}
					</button>
				</div>

				{/* Overlay for mobile */}
				{isFilterOpen && (
					<button
						type="button"
						className="lg:hidden fixed inset-0 bg-black/40 z-40"
						onClick={() => setFilterOpen(false)}
						aria-label="Close filters"
					/>
				)}

				{/* Aside Filters */}
				<aside
					className={`lg:sticky lg:top-4 lg:self-start lg:bg-white lg:border lg:border-gray-200 lg:rounded-lg lg:p-6 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-visible
						${
							isFilterOpen
								? "fixed inset-0 top-14 left-0 right-0 bottom-0 lg:relative lg:top-auto lg:left-auto lg:right-auto lg:bottom-auto bg-white z-50 overflow-y-auto p-4"
								: "hidden lg:block"
						}`}
				>
					{/* Close button for mobile */}
					<div className="lg:hidden flex justify-between items-center mb-4">
						<h3 className="text-lg font-semibold">Filters</h3>
						<button
							type="button"
							onClick={() => setFilterOpen(false)}
							className="text-gray-500 hover:text-gray-700 text-xl"
						>
							✕
						</button>
					</div>

					{/* Filter Content */}
					<div className="space-y-6">
						<div>
							<h4 className="font-semibold text-gray-900 mb-2">Sort By</h4>
							<p className="text-xs text-gray-500 mb-3">
								Sorting what is displayed on the page, not all venues
							</p>
							<SortFilter sortOption={sortOption} onSortChange={setSortOption} />
						</div>

						<hr className="border-gray-200" />

						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Location</h4>
							<CityFilter
								selectedCities={selectedCities}
								onCityChange={setSelectedCities}
								venues={venues}
							/>
						</div>

						<hr className="border-gray-200" />

						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
							<AmenitiesFilter
								amenitiesFilter={amenitiesFilter}
								setAmenitiesFilter={setAmenitiesFilter}
							/>
						</div>

						<hr className="border-gray-200" />

						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
							<PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
						</div>

						<hr className="border-gray-200" />

						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Rating</h4>
							<RatingFilter ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} />
						</div>
					</div>

					{/* Mobile: Apply Filters Button */}
					<div className="lg:hidden mt-6 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={() => setFilterOpen(false)}
							className="w-full px-4 py-2 bg-btn text-white hover:bg-btn-bg-hover transition-colors font-medium"
						>
							Apply Filters
						</button>
					</div>
				</aside>
				<div>
					{sortedVenues && sortedVenues.length > 0 ? (
						<div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
							{sortedVenues.map((venue: Venue) => (
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
											<p>{venue.location?.address}</p>
											<p>
												{new Date(venue.created).toLocaleDateString("en-GB", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</p>
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
			<div className="flex flex-col items-center bg-gray-50 p-4 w-full">
				<div className="w-full max-w-md">
					<div className="flex flex-row justify-between mt-4 p-2 w-full">
						<button
							type="button"
							onClick={() => setPage(currentPage > 1 ? currentPage - 1 : 1)}
							className="btn"
						>
							<FaArrowLeft />
						</button>

						<div>
							Page {data?.meta?.currentPage as number} of {data?.meta?.pageCount as number}
						</div>

						<button
							type="button"
							onClick={() => {
								setPage(currentPage ? currentPage + 1 : currentPage)
							}}
							className="btn"
						>
							<FaArrowRight />
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Venues
