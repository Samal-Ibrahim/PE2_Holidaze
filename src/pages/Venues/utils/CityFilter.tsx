import type { Venue } from "@/types/venue"

interface Props {
	selectedCities: string[]
	onCityChange: (cities: string[]) => void
	venues: Venue[]
}

const CityFilter = ({ selectedCities, onCityChange, venues }: Props) => {
	const handleToggle = (city: string) => {
		if (selectedCities.includes(city)) {
			onCityChange(selectedCities.filter((i) => i !== city))
		} else {
			onCityChange([...selectedCities, city])
		}
	}

	const cityCounts = {
		newyork: venues.filter((v) => v.location?.city?.toLowerCase() === "new york").length,
		london: venues.filter((v) => v.location?.city?.toLowerCase() === "london").length,
		paris: venues.filter((v) => v.location?.city?.toLowerCase() === "paris").length,
		tokyo: venues.filter((v) => v.location?.city?.toLowerCase() === "tokyo").length,
		rome: venues.filter((v) => v.location?.city?.toLowerCase() === "rome").length,
		barcelona: venues.filter((v) => v.location?.city?.toLowerCase() === "barcelona").length,
		amsterdam: venues.filter((v) => v.location?.city?.toLowerCase() === "amsterdam").length,
		dubai: venues.filter((v) => v.location?.city?.toLowerCase() === "dubai").length,
		sydney: venues.filter((v) => v.location?.city?.toLowerCase() === "sydney").length,
		oslo: venues.filter((v) => v.location?.city?.toLowerCase() === "oslo").length,
	}

	return (
		<div className="flex flex-col gap-4">
			<h5>Filter by country</h5>
			<div className="flex flex-col gap-2 bg-white">
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input
						type="checkbox"
						name="newyork"
						id="newyork"
						onChange={() => handleToggle("new york")}
					/>
					<label htmlFor="newyork" className="block font-medium text-gray-700 text-sm">
						New York ({cityCounts.newyork})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input type="checkbox" name="oslo" id="oslo" onChange={() => handleToggle("oslo")} />
					<label htmlFor="oslo" className="block font-medium text-gray-700 text-sm">
						Oslo ({cityCounts.oslo})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input type="checkbox" name="rome" id="rome" onChange={() => handleToggle("rome")} />

					<label htmlFor="rome" className="block font-medium text-gray-700 text-sm">
						Rome ({cityCounts.rome})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input
						type="checkbox"
						name="tokyo"
						id="tokyo"
						value="tokyo"
						onChange={() => handleToggle("tokyo")}
					/>
					<label htmlFor="tokyo" className="block font-medium text-gray-700 text-sm">
						Tokyo ({cityCounts.tokyo})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input type="checkbox" name="paris" id="paris" onChange={() => handleToggle("paris")} />
					<label htmlFor="paris" className="block font-medium text-gray-700 text-sm">
						Paris ({cityCounts.paris})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input
						type="checkbox"
						name="london"
						id="london"
						value="london"
						onChange={() => handleToggle("london")}
					/>
					<label htmlFor="london" className="block font-medium text-gray-700 text-sm">
						London ({cityCounts.london})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input
						type="checkbox"
						name="barcelona"
						id="barcelona"
						onChange={() => handleToggle("barcelona")}
					/>
					<label htmlFor="barcelona" className="block font-medium text-gray-700 text-sm">
						Barcelona ({cityCounts.barcelona})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input
						type="checkbox"
						name="amsterdam"
						id="amsterdam"
						onChange={() => handleToggle("amsterdam")}
					/>

					<label htmlFor="amsterdam" className="block font-medium text-gray-700 text-sm">
						Amsterdam ({cityCounts.amsterdam})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input type="checkbox" name="dubai" id="dubai" onChange={() => handleToggle("dubai")} />
					<label htmlFor="dubai" className="block font-medium text-gray-700 text-sm">
						Dubai ({cityCounts.dubai})
					</label>
				</div>
				<div className="flex flex-row items-center align-center w-full gap-2">
					<input
						type="checkbox"
						name="sydney"
						id="sydney"
						onChange={() => handleToggle("sydney")}
					/>
					<label htmlFor="sydney" className="block font-medium text-gray-700 text-sm">
						Sydney ({cityCounts.sydney})
					</label>
				</div>
			</div>
		</div>
	)
}

export default CityFilter
