import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "react-toastify"
import updateProfileApi from "@/api/profiles/updateProfileApi"
import { useMenuToggle } from "@/context/MenuToggleContext"
import type { ApiResponse, Profile } from "@/types"

const EditProfile = (profileDetails: ApiResponse<Profile>) => {
	const { setMenuOpen } = useMenuToggle()
	const queryClient = useQueryClient()
	const profile = profileDetails.data
	const username = profile.name

	// ✅ GOOD - Controlled inputs with state
	const [formData, setFormData] = useState({
		avatarUrl: profile.avatar?.url || "",
		bannerUrl: profile.banner.url || "",
		bio: profile.bio || "",
		venueManager: profile.venueManager || false,
	})

	const mutation = useMutation({
		mutationFn: updateProfileApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", username] })
			setMenuOpen(false)
			toast.success("Profile updated successfully!")
		},
		onError: () => {
			toast.error("Failed to update profile.")
		},
	})

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

	return (
		<div className="relative w-full h-full flex justify-center items-center">
			<div className="w-3xl bg-white p-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-2xl font-bold">Edit Profile</h3>
					<button
						type="button"
						onClick={() => setMenuOpen(false)}
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
	)
}

export default EditProfile
