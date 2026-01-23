interface Props {
	priceRange: number
	setPriceRange: (price: number) => void
}

const PriceFilter = ({ priceRange, setPriceRange }: Props) => {
	return (
		<div>
			<h5>Price per Night</h5>
			<input
				type="range"
				min="5"
				max="10000"
				value={priceRange}
				onChange={(e) => setPriceRange(Number(e.target.value))}
				className="w-full"
			/>
			<div className="text-sm text-gray-600">Up to ${priceRange}</div>
		</div>
	)
}

export default PriceFilter
