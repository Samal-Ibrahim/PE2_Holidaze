import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import fetchSingleVenue from "@/api/venues/fetchSingleVenue"

const viewVenue = () => {
	const { id } = useParams()

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["venue"],
		queryFn: () => fetchSingleVenue(id || ""),
	})

	if (isLoading) return <p>Loading...</p>
	if (isError) return <p>Error: {(error as Error).message}</p>

	const venue = data?.data ?? []
	console.log(venue)
	return <div>viewVenue</div>
}

export default viewVenue
