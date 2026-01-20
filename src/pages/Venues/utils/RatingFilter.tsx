import { IoMdStar } from "react-icons/io"

interface Props {
	ratingFilter: number[]
	setRatingFilter: (ratings: number[]) => void
}

const RatingFilter = ({ ratingFilter, setRatingFilter }: Props) => {
	return (
		<div>
			<h5>Rating</h5>
			<div className="w-full flex gap-2">
				<input
					type="checkbox"
					id="1star"
					checked={ratingFilter.includes(1)}
					onChange={() => {
						if (ratingFilter.includes(1)) {
							setRatingFilter(ratingFilter.filter((r) => r !== 1))
						} else {
							setRatingFilter([...ratingFilter, 1])
						}
					}}
				/>
				<div className="flex flex-row items-center">
					<label htmlFor="1star" className="w-fit">
						1
					</label>
					<IoMdStar />
				</div>
			</div>
			<div className="w-full flex gap-2 ">
				<input
					type="checkbox"
					id="2star"
					checked={ratingFilter.includes(2)}
					onChange={() => {
						if (ratingFilter.includes(2)) {
							setRatingFilter(ratingFilter.filter((r) => r !== 2))
						} else {
							setRatingFilter([...ratingFilter, 2])
						}
					}}
				/>
				<div className="flex flex-row items-center">
					<label htmlFor="2star">2</label>
					<IoMdStar />
				</div>
			</div>
			<div className="w-full flex gap-2 ">
				<input
					type="checkbox"
					id="3star"
					checked={ratingFilter.includes(3)}
					onChange={() => {
						if (ratingFilter.includes(3)) {
							setRatingFilter(ratingFilter.filter((r) => r !== 3))
						} else {
							setRatingFilter([...ratingFilter, 3])
						}
					}}
				/>
				<div className="flex flex-row items-center">
					<label htmlFor="3star">3</label>
					<IoMdStar />
				</div>
			</div>
			<div className="w-full flex gap-2 ">
				<input
					type="checkbox"
					id="4star"
					checked={ratingFilter.includes(4)}
					onChange={() => {
						if (ratingFilter.includes(4)) {
							setRatingFilter(ratingFilter.filter((r) => r !== 4))
						} else {
							setRatingFilter([...ratingFilter, 4])
						}
					}}
				/>
				<div className="flex flex-row items-center">
					<label htmlFor="4star">4</label>
					<IoMdStar />
				</div>
			</div>
			<div className="w-full flex gap-2 ">
				<input
					type="checkbox"
					id="5star"
					checked={ratingFilter.includes(5)}
					onChange={() => {
						if (ratingFilter.includes(5)) {
							setRatingFilter(ratingFilter.filter((r) => r !== 5))
						} else {
							setRatingFilter([...ratingFilter, 5])
						}
					}}
				/>
				<div className="flex flex-row items-center">
					<label htmlFor="5star">5</label>
					<IoMdStar />
				</div>
			</div>
		</div>
	)
}

export default RatingFilter
