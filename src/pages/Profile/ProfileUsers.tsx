// ✅ GOOD - Uses React Query like ProfileMe
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import userProfile from "@/api/profiles/holidazeProfile"
import type { Profile } from "@/types"

const ProfileUsers = () => {
	const { username } = useParams()

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["user", username],
		queryFn: () => userProfile(username as string),
		enabled: !!username,
	})

	if (!username) return <p>Invalid username</p>
	if (isLoading) return <p>Loading profile...</p>
	if (isError) return <p>Error: {(error as Error).message}</p>

	const profile = data?.data as Profile

	return (
		<div className="p-4">
			<h4 className="text-2xl font-bold">{profile.name}</h4>
			<p className="text-gray-600">{profile.email}</p>

			{profile.avatar && (
				<img
					src={profile.avatar.url}
					alt={profile.avatar.alt}
					className="w-32 h-32 rounded-full mt-4"
				/>
			)}

			<div className="mt-4 space-y-2">
				<p>
					<strong>Bio:</strong> {profile.bio || "No bio"}
				</p>
				<p>
					<strong>Venue Manager:</strong> {profile.venueManager ? "Yes" : "No"}
				</p>
				<p>
					<strong>Bookings:</strong> {profile._count.bookings}
				</p>
				<p>
					<strong>Venues:</strong> {profile._count.venues}
				</p>
			</div>
		</div>
	)
}

export default ProfileUsers
