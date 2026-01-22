interface Props {
	onSortChange: (sort: string) => void
	sortOption: string
}

const SortFilter = ({ sortOption, onSortChange }: Props) => {
	const handleChange = (value: string) => {
		onSortChange(value)
	}

	return (
		<div>
			<label htmlFor="filter-by-type" className="block mb-1 font-medium text-gray-700 text-sm">
				Sort by
			</label>
			<select
				value={sortOption}
				name="option"
				id="filter-by-type"
				className="w-full border"
				onChange={(e) => {
					handleChange(e.target.value)
				}}
			>
				<option value="latest">Latest</option>
				<option value="Oldest">Oldest</option>
				<option value="cheapest">Cheapest</option>
				<option value="expensive">Most expensive</option>
			</select>
		</div>
	)
}

export default SortFilter
