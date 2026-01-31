import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { fetchProfile } from "@/api/profiles/holidazeProfileApi"
import { updateProfile } from "@/api/profiles/updateProfileApi"
import { PROFILE_PAGE_URL } from "@/config/constants"
import { useAuth } from "@/hooks/useAuth"

const EditProfile = () => {
	const { user } = useAuth()
	const username = user?.name
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const location = useLocation()
	const state = location.state as { backgroundLocation?: Location }

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["profile", username],
		queryFn: () => fetchProfile(username as string),
		enabled: !!username,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	})

	const profile = data?.data

	const [formData, setFormData] = useState({
		avatarUrl: "",
		bannerUrl: "",
		bio: "",
		venueManager: false,
	})

	useEffect(() => {
		if (!profile) return

		setFormData({
			avatarUrl: profile.avatar?.url ?? "",
			bannerUrl: profile.banner?.url ?? "",
			bio: profile.bio ?? "",
			venueManager: profile.venueManager ?? false,
		})
	}, [profile])

	const mutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile", username] })
			close()
			toast.success("Profile updated successfully!")
		},
		onError: () => {
			toast.error("Failed to update profile.")
		},
	})

	if (!username) return <p>Not logged in</p>
	if (isLoading) return <p>Loading profile...</p>
	if (isError) return <p>{(error as Error).message}</p>

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		mutation.mutate({
			avatar: {
				url: formData.avatarUrl,
				alt: "User Avatar",
			},
			banner: {
				url: formData.bannerUrl,
				alt: "User Banner",
			},
			bio: formData.bio,
			venueManager: formData.venueManager,
		})
	}

	const close = () => {
		if (state?.backgroundLocation) navigate(-1)
		else navigate(PROFILE_PAGE_URL, { replace: true })
	}

	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center h-full">
			<div className="relative w-full h-full flex justify-center items-center">
				<div className="w-3xl bg-white p-4">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-2xl font-bold">Edit Profile</h3>
						<button
							type="button"
							onClick={close}
							className="hover:bg-gray-100 px-2 py-1 cursor-pointer"
						>
							Close
						</button>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4 shadow-lg">
						<label htmlFor="avatarUrl">Avatar URL</label>
						<input
							value={formData.avatarUrl}
							onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
							type="url"
							className="bg-gray-100/50 border border-black/10 p-2"
							placeholder="https://example.com/avatar.jpg"
							id="avatarUrl"
						/>

						<label htmlFor="bannerUrl">Banner URL</label>
						<input
							value={formData.bannerUrl}
							onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
							type="url"
							className="bg-gray-100/50 border border-black/10 p-2"
							placeholder="https://example.com/banner.jpg"
							id="bannerUrl"
						/>

						<label htmlFor="bio">Bio</label>
						<textarea
							value={formData.bio}
							onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
							className="bg-gray-100/50 border border-black/10 p-2"
							placeholder="Tell us about yourself"
							id="bio"
							rows={4}
						/>

						<div className="flex gap-2">
							<input
								checked={formData.venueManager}
								onChange={(e) => setFormData({ ...formData, venueManager: e.target.checked })}
								type="checkbox"
								className="w-4 h-4"
								id="venueManager"
							/>
							<label htmlFor="venueManager">Venue Manager?</label>
						</div>

						<button className="btn" disabled={mutation.isPending} type="submit">
							{mutation.isPending ? "Saving..." : "Save Changes"}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default EditProfile
