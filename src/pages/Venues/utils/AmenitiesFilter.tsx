type Props = {
	amenitiesFilter: string[]
	setAmenitiesFilter: (amenities: string[]) => void
}

const AmenitiesFilter = ({ amenitiesFilter, setAmenitiesFilter }: Props) => {
	const handleCheckboxChange = (amenity: string) => {
		if (amenitiesFilter.includes(amenity)) {
			setAmenitiesFilter(amenitiesFilter.filter((a) => a !== amenity))
		} else {
			setAmenitiesFilter([...amenitiesFilter, amenity])
		}
	}
	return (
		<div>
			<h5>Amenities</h5>
			<div className="flex flex-row gap-2">
				<input
					type="checkbox"
					id="wifi"
					 checked={amenitiesFilter.includes("wifi")}
					onChange={() => {
						handleCheckboxChange("wifi")
					}}
				/>
				<label htmlFor="wifi">WiFi</label>
			</div>
			<div className="flex flex-row gap-2">
				<input
					type="checkbox"
					id="parking"
					 checked={amenitiesFilter.includes("parking")}
					onChange={() => {
						handleCheckboxChange("parking")
					}}
				/>

				<label htmlFor="parking">Parking</label>
			</div>
			<div className="flex flex-row gap-2">
				<input
					type="checkbox"
					id="breakfast"
					 checked={amenitiesFilter.includes("breakfast")}
					onChange={() => {
						handleCheckboxChange("breakfast")
					}}
				/>
				<label htmlFor="breakfast">Breakfast</label>
			</div>
			<div className="flex flex-row gap-2">
				<input
					type="checkbox"
					id="pets"
					 checked={amenitiesFilter.includes("pets")}
					onChange={() => {
						handleCheckboxChange("pets")
					}}
				/>
				<label htmlFor="pets">Pets Allowed</label>
			</div>
		</div>
	)
}

export default AmenitiesFilter
