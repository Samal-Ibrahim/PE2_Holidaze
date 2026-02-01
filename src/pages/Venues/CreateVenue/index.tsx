import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { type CreateVenueRequest, createVenueApi } from "@/api/venues/createVenue"
import { VENUES_PAGE_URL } from "@/config/constants"
import type { VenueLocation, VenueMeta } from "@/types/venue"

const CreateVenue = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState<CreateVenueRequest>({
		name: "",
		description: "",
		media: [{ url: "", alt: "" }],
		price: 0,
		maxGuests: 1,
		rating: 0,
		meta: {
			wifi: false,
			parking: false,
			breakfast: false,
			pets: false,
		},
		location: {
			address: "",
			city: "",
			zip: "",
			country: "",
			continent: "",
			lat: 0,
			lng: 0,
		},
	})
	const [validationError, setValidationError] = useState("")

	const { mutate, isPending } = useMutation({
		mutationFn: (data: CreateVenueRequest) => createVenueApi(data),
		onSuccess: () => {
			toast.success("Venue created successfully!")
			navigate(`${VENUES_PAGE_URL}`)
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "Failed to create venue")
		},
	})

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: string
	) => {
		const value = e.target.value
		setFormData((prev) => ({
			...prev,
			[field]: field === "price" || field === "maxGuests" ? Number(value) : value,
		}))
	}

	const handleMediaChange = (index: number, field: "url" | "alt", value: string) => {
		setFormData((prev) => {
			const newMedia = [...prev.media]
			newMedia[index] = { ...newMedia[index], [field]: value }
			return { ...prev, media: newMedia }
		})
	}

	const addMediaField = () => {
		setFormData((prev) => ({
			...prev,
			media: [...prev.media, { url: "", alt: "" }],
		}))
	}

	const removeMediaField = (index: number) => {
		setFormData((prev) => ({
			...prev,
			media: prev.media.filter((_, i) => i !== index),
		}))
	}

	const handleLocationChange = (field: keyof VenueLocation, value: string | number) => {
		setFormData((prev) => ({
			...prev,
			location: {
				...prev.location,
				[field]: field === "lat" || field === "lng" ? Number(value) : value,
			},
		}))
	}

	const handleMetaChange = (field: keyof VenueMeta) => {
		setFormData((prev) => ({
			...prev,
			meta: {
				...prev.meta,
				[field]: !prev.meta[field],
			},
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validate form
		const validMediaUrls = formData.media.filter((m) => m.url.trim() !== "")
		if (validMediaUrls.length === 0) {
			setValidationError("At least one valid image URL is required")
			return
		}

		if (!formData.name.trim()) {
			setValidationError("Venue name is required")
			return
		}

		if (formData.description.length < 10) {
			setValidationError("Description must be at least 10 characters")
			return
		}

		if (formData.price <= 0) {
			setValidationError("Price must be greater than 0")
			return
		}

		if (formData.maxGuests < 1) {
			setValidationError("Max guests must be at least 1")
			return
		}

		setValidationError("")
		mutate(formData)
	}

	return (
		<div className="flex items-center justify-center p-4 min-h-screen bg-gray-50">
			<div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
				<h2 className="text-3xl font-bold mb-6">Create Venue</h2>

				{validationError && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{validationError}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Info */}
					<div className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium mb-1">
								Venue Name *
							</label>
							<input
								type="text"
								name="name"
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange(e, "name")}
								disabled={isPending}
								required
								className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
								placeholder="Enter venue name"
								autoComplete="name"
							/>
						</div>

						<div>
							<label htmlFor="description" className="block text-sm font-medium mb-1">
								Description *
							</label>
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={(e) => handleInputChange(e, "description")}
								disabled={isPending}
								required
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
								placeholder="Enter venue description"
								autoComplete="description"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="price" className="block text-sm font-medium mb-1">
									Price per Night *
								</label>
								<input
									type="number"
									name="price"
									id="price"
									value={formData.price}
									onChange={(e) => handleInputChange(e, "price")}
									disabled={isPending}
									required
									min="0"
									step="0.01"
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="0.00"
								/>
							</div>
							<div>
								<label htmlFor="maxGuests" className="block text-sm font-medium mb-1">
									Max Guests *
								</label>
								<input
									type="number"
									name="maxGuests"
									id="maxGuests"
									value={formData.maxGuests}
									onChange={(e) => handleInputChange(e, "maxGuests")}
									disabled={isPending}
									required
									min="1"
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="1"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="rating" className="block text-sm font-medium mb-1">
								Rating (0-5)
							</label>
							<input
								type="number"
								name="rating"
								id="rating"
								value={formData.rating}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										rating: Math.max(0, Math.min(5, Number(e.target.value))),
									}))
								}
								disabled={isPending}
								min="0"
								max="5"
								step="0.5"
								className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
								placeholder="0"
							/>
						</div>
					</div>

					{/* Media */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold">Media</h3>
						{formData.media.map((item, index) => (
							<div
								key={`media-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <using index as key is acceptable here>
									index
								}`}
								className="space-y-2 p-3 border border-gray-200"
							>
								<div>
									<label htmlFor={`media-url-${index}`} className="block text-sm font-medium mb-1">
										Image URL
									</label>
									<input
										type="url"
										id={`media-url-${index}`}
										name={`media-url-${index}`}
										value={item.url}
										onChange={(e) => handleMediaChange(index, "url", e.target.value)}
										disabled={isPending}
										className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
										placeholder="https://example.com/image.jpg"
									/>
								</div>
								<div className="flex gap-2">
									<input
										type="text"
										id={`media-alt-${index}`}
										name={`media-alt-${index}`}
										value={item.alt}
										onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
										disabled={isPending}
										className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
										placeholder="Alt text"
									/>
									{formData.media.length > 1 && (
										<button
											type="button"
											onClick={() => removeMediaField(index)}
											disabled={isPending}
											className="px-3 py-2 text-red-500 hover:bg-red-400 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Remove
										</button>
									)}
								</div>
							</div>
						))}
						<button
							type="button"
							onClick={addMediaField}
							disabled={isPending}
							className="px-3 py-2 bg-btn text-white hover:bg-btn-bg-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Add Another Image
						</button>
					</div>

					{/* Amenities */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold">Amenities</h3>
						<div className="space-y-2">
							{Object.entries(formData.meta).map(([key, value]) => (
								<label
									key={key}
									className="flex items-center gap-2 cursor-pointer disabled:opacity-50"
								>
									<input
										type="checkbox"
										checked={value}
										onChange={() => handleMetaChange(key as keyof VenueMeta)}
										disabled={isPending}
										className="w-4 h-4 rounded disabled:cursor-not-allowed"
									/>
									<span className="capitalize">{isPending ? "" : key}</span>
								</label>
							))}
						</div>
					</div>

					{/* Location */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold">Location</h3>
						<div>
							<label htmlFor="address" className="block text-sm font-medium mb-1">
								Address
							</label>
							<input
								type="text"
								id="address"
								name="address"
								value={formData.location.address}
								onChange={(e) => handleLocationChange("address", e.target.value)}
								disabled={isPending}
								className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
								placeholder="Street address"
								autoComplete="street-address"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="city" className="block text-sm font-medium mb-1">
									City
								</label>
								<input
									type="text"
									id="city"
									name="city"
									value={formData.location.city}
									onChange={(e) => handleLocationChange("city", e.target.value)}
									disabled={isPending}
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="City"
									autoComplete="address-level2"
								/>
							</div>
							<div>
								<label htmlFor="zip" className="block text-sm font-medium mb-1">
									ZIP Code
								</label>
								<input
									type="text"
									id="zip"
									name="zip"
									value={formData.location.zip}
									onChange={(e) => handleLocationChange("zip", e.target.value)}
									disabled={isPending}
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="ZIP code"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="country" className="block text-sm font-medium mb-1">
									Country
								</label>
								<input
									type="text"
									id="country"
									name="country"
									value={formData.location.country}
									onChange={(e) => handleLocationChange("country", e.target.value)}
									disabled={isPending}
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="Country"
									autoComplete="country"
								/>
							</div>
							<div>
								<label htmlFor="continent" className="block text-sm font-medium mb-1">
									Continent
								</label>
								<input
									type="text"
									id="continent"
									name="continent"
									value={formData.location.continent}
									onChange={(e) => handleLocationChange("continent", e.target.value)}
									disabled={isPending}
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="Continent"
									autoComplete="continent"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="lat" className="block text-sm font-medium mb-1">
									Latitude
								</label>
								<input
									type="number"
									id="lat"
									name="lat"
									value={formData.location.lat}
									onChange={(e) => handleLocationChange("lat", e.target.value)}
									disabled={isPending}
									step="0.0001"
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="0.0000"
								/>
							</div>
							<div>
								<label htmlFor="lng" className="block text-sm font-medium mb-1">
									Longitude
								</label>
								<input
									type="number"
									id="lng"
									name="lng"
									value={formData.location.lng}
									onChange={(e) => handleLocationChange("lng", e.target.value)}
									disabled={isPending}
									step="0.0001"
									className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:bg-gray-100 disabled:cursor-not-allowed"
									placeholder="0.0000"
								/>
							</div>
						</div>
					</div>

					{/* Submit Buttons */}
					<div className="flex gap-4 pt-4">
						<button
							type="submit"
							disabled={isPending}
							className="flex-1 px-4 py-2 bg-btn text-white hover:bg-btn-bg-hover disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
						>
							{isPending ? "Creating..." : "Create Venue"}
						</button>
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-white cursor-pointer"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateVenue
