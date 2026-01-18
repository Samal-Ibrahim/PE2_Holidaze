import { IoMdStar } from "react-icons/io"

type RatingStarsProps = {
	rating: number
}

const StarRating = ({ rating }: RatingStarsProps) => {
	return (
		<div className="flex gap-1 items-center">
			<IoMdStar className="inline text-black" />
			{rating >= 0 && `${rating}`}
		</div>
	)
}

export default StarRating
