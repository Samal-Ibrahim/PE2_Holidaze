import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import registerApi from "@/api/auth/registerApi"
import { isValidStudentEmail } from "@/lib/validators"

const Register = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate()

	const { mutate, isPending } = useMutation({
		mutationFn: registerApi,
		onSuccess: (data) => {
			if ("user" in data) {
				toast.success("Registration successful! Please login.")
				navigate("/login")
			} else {
				setErrorMessage(data.errors.map((err) => err.message).join(", "))
			}
		},
		onError: (error) => {
			setErrorMessage(error instanceof Error ? error.message : "Registration failed")
		},
	})

	const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		const name = formData.get("name") as string
		const email = formData.get("email") as string
		const password = formData.get("password") as string
		const bio = formData.get("bio") as string
		const venueManager = formData.get("venueManager") === "on"

		if (!isValidStudentEmail(email)) {
			setErrorMessage("Email must end with @stud.noroff.no!")
			return
		}

		if (password.length < 8) {
			setErrorMessage("Password must be at least 8 characters")
			return
		}

		mutate({
			name: name.trim(),
			email: email.trim(),
			password,
			bio: bio || undefined,
			venueManager,
		})
	}

	return (
		<div className="h-full flex items-center justify-center p-4">
			<div className="flex flex-col gap-6 items-center justify-center">
				<h3>Register Page</h3>
				<form
					aria-label="register form"
					onSubmit={handleRegister}
					className="flex flex-col gap-4 max-w-lg min-w-md p-4"
				>
					{errorMessage && <p className="text-red-600">{errorMessage}</p>}

					<div className="flex flex-col w-full">
						<label htmlFor="name">Name:</label>
						<input
							type="text"
							className="bg-content-bg text-fg p-2 w-full"
							placeholder="Enter your name"
							required
							id="name"
							name="name"
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							className="bg-content-bg text-fg p-2 w-full"
							placeholder="Enter your email"
							required
							id="email"
							name="email"
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							className="bg-content-bg text-fg p-2 w-full"
							placeholder="Enter your password"
							id="password"
							name="password"
							minLength={8}
							required
						/>
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="bio">Bio (optional):</label>
						<textarea
							className="bg-content-bg text-fg p-2 w-full"
							placeholder="Tell us about yourself"
							id="bio"
							name="bio"
							rows={3}
						/>
					</div>

					<div className="flex gap-2 items-center">
						<input type="checkbox" id="venueManager" name="venueManager" className="w-4 h-4" />
						<label htmlFor="venueManager">Register as Venue Manager</label>
					</div>

					<div className="flex gap-1 items-center">
						<p className="text-sm">Already have an account?</p>
						<Link to="/login" className="font-bold text-sm hover:underline">
							Login here
						</Link>
					</div>

					<button
						type="submit"
						disabled={isPending}
						className="bg-btn w-full hover:bg-btn-bg-hover hover:text-btn-text-hover cursor-pointer text-btn-text p-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isPending ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Register
