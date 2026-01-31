import { useMutation, useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { editVenueApi } from "@/api/venues/editVenueApi"
import { fetchSingleVenue } from "@/api/venues/fetchSingleVenue"
import { PROFILE_PAGE_URL } from "@/config/constants"

type EditVenueRequestProps = {
	name: string
	description: string
	media: {
		url: string
		alt: string
	}[]
	price: number
	maxGuests: number
	rating: number
	meta: {
		wifi: boolean
		parking: boolean
		breakfast: boolean
		pets: boolean
	}
	location: {
		address: string
		city: string
		zip: string
		country: string
		continent: string
		lat: number
		lng: number
	}
}

const EditVenues = () => {
	const { id } = useParams()

	const location = useLocation()
	const navigate = useNavigate()

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venue", id],
		queryFn: () => fetchSingleVenue(id || ""),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: EditVenueRequestProps }) =>
			editVenueApi(id, data),
		onSuccess: () => {
			toast.success("Venue updated successfully!")
			close()
		},
		onError: () => {
			toast.error("Failed to update venue.")
		},
	})

	// const qc = useQueryClient()

	const state = location.state as { backgroundLocation?: Location }
	const close = () => {
		if (state?.backgroundLocation) navigate(-1)
		else navigate(PROFILE_PAGE_URL, { replace: true })
	}

	if (isLoading) return <p>Loading venue details...</p>
	if (isError) return <p>Error loading venue: {(error as Error).message}</p>

	const venue = data?.data

	if (!venue || Array.isArray(venue)) return <p>Venue not found</p>

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const fd = new FormData(e.currentTarget)

		const getStr = (key: string) => String(fd.get(key) ?? "").trim()
		// Convert string to number, default to 0 if empty string
		const getNum = (key: string) => {
			const v = getStr(key)
			return v === "" ? 0 : Number(v)
		}
		// Convert checkbox 'on' value to boolean
		const getBool = (key: string) => fd.get(key) === "on"

		const mediaUrl = getStr("mediaUrl")

		const payload = {
			name: getStr("name"),
			description: getStr("description"),
			media: mediaUrl ? [{ url: mediaUrl, alt: "" }] : [],

			price: getNum("price"),
			maxGuests: getNum("maxGuests"),
			rating: getNum("rating"),

			meta: {
				wifi: getBool("wifi"),
				parking: getBool("parking"),
				breakfast: getBool("breakfast"),
				pets: getBool("pets"),
			},

			location: {
				address: getStr("address"),
				city: getStr("city"),
				zip: getStr("zip"),
				country: getStr("country"),
				continent: getStr("continent"),
				lat: getNum("lat"),
				lng: getNum("lng"),
			},
		}

		mutation.mutate({ id: venue.id, data: payload })
	}

	return (
		<div className="relative w-full h-full flex justify-center items-center">
			<div className="w-3xl bg-white p-4 max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-2xl font-bold">Edit Venue</h3>
					<button
						type="button"
						onClick={close}
						className="hover:bg-gray-100 px-2 py-1 cursor-pointer"
					>
						Close
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4 shadow-lg">
					<label htmlFor="name">Venue Name</label>
					<input
						type="text"
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="Venue name"
						id="name"
						name="name"
						defaultValue={venue.name}
					/>

					<label htmlFor="description">Description</label>
					<textarea
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="Describe your venue"
						id="description"
						name="description"
						rows={4}
						defaultValue={venue.description}
					/>

					<label htmlFor="mediaUrl">Image URL</label>
					<input
						type="url"
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="https://example.com/image.jpg"
						id="mediaUrl"
						name="mediaUrl"
						defaultValue={venue.media[0]?.url}
					/>

					<label htmlFor="price">Price per Night</label>
					<input
						type="number"
						className="bg-gray-100/50 border border-black/10 p-2"
						id="price"
						name="price"
						defaultValue={venue.price}
					/>

					<label htmlFor="maxGuests">Max Guests</label>
					<input
						type="number"
						className="bg-gray-100/50 border border-black/10 p-2"
						id="maxGuests"
						name="maxGuests"
						defaultValue={venue.maxGuests}
					/>

					<label htmlFor="rating">Rating</label>
					<input
						type="number"
						min="0"
						max="5"
						step="0.1"
						className="bg-gray-100/50 border border-black/10 p-2"
						id="rating"
						name="rating"
						defaultValue={venue.rating}
					/>

					<h4 className="text-lg font-semibold mt-4">Amenities</h4>
					<div className="flex gap-4">
						<label className="flex items-center gap-2">
							<input type="checkbox" name="wifi" defaultChecked={venue.meta.wifi} />
							WiFi
						</label>
						<label className="flex items-center gap-2">
							<input type="checkbox" name="parking" defaultChecked={venue.meta.parking} />
							Parking
						</label>
						<label className="flex items-center gap-2">
							<input type="checkbox" name="breakfast" defaultChecked={venue.meta.breakfast} />
							Breakfast
						</label>
						<label className="flex items-center gap-2">
							<input type="checkbox" name="pets" defaultChecked={venue.meta.pets} />
							Pets
						</label>
					</div>

					<h4 className="text-lg font-semibold mt-4">Location</h4>
					<label htmlFor="address">Address</label>
					<input
						type="text"
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="Street address"
						id="address"
						name="address"
						defaultValue={venue.location.address}
					/>

					<label htmlFor="city">City</label>
					<input
						type="text"
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="City"
						id="city"
						name="city"
						defaultValue={venue.location.city}
					/>

					<label htmlFor="zip">Zip Code</label>
					<input
						type="text"
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="Zip code"
						id="zip"
						name="zip"
						defaultValue={venue.location.zip}
					/>

					<label htmlFor="country">Country</label>
					<input
						type="text"
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="Country"
						id="country"
						name="country"
						defaultValue={venue.location.country}
					/>

					<label htmlFor="continent">Continent</label>
					<input
						type="text"
						className="bg-gray-100/50 border border-black/10 p-2"
						placeholder="Continent"
						id="continent"
						name="continent"
						defaultValue={venue.location.continent}
					/>

					<label htmlFor="lat">Latitude</label>
					<input
						type="number"
						className="bg-gray-100/50 border border-black/10 p-2"
						id="lat"
						name="lat"
						defaultValue={venue.location.lat}
					/>

					<label htmlFor="lng">Longitude</label>
					<input
						type="number"
						className="bg-gray-100/50 border border-black/10 p-2"
						id="lng"
						name="lng"
						defaultValue={venue.location.lng}
					/>

					<div className="flex gap-2 mt-4">
						<button className="btn btn-danger" type="submit">
							{mutation.isPending ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default EditVenues
