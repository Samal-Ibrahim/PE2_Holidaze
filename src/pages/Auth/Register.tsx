import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { register } from "@/api/auth/registerApi"
import { isValidStudentEmail } from "@/lib/validators"

const Register = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const navigate = useNavigate()

	const { mutate, isPending } = useMutation({
		mutationFn: register,
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
		})
	}

	return (
		<div className="flex items-center justify-center p-2 h-full">
			<div className="flex flex-col gap-6 items-center justify-center bg-white p-4 shadow">
				<h3>Register Page</h3>
				<form
					aria-label="register form"
					onSubmit={handleRegister}
					className="flex flex-col gap-4 xs:w-120 xs:p-6 2xs:w-[20rem]"
				>
					{errorMessage && <p className="text-red-600">{errorMessage}</p>}

					<div className="flex flex-col w-full">
						<label htmlFor="name">Name:</label>
						<input
							type="text"
							className=" text-fg p-2 w-full bg-gray-100"
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
							className=" text-fg p-2 w-full bg-gray-100"
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
							className=" text-fg p-2 w-full bg-gray-100"
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
							className=" text-fg p-2 w-full bg-gray-100"
							placeholder="Tell us about yourself"
							id="bio"
							name="bio"
							rows={3}
						/>
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
						className="w-full mt-4 p-2 text-btn-text bg-btn transition-colors cursor-pointer hover:bg-btn-bg-hover hover:text-btn-text-hover disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isPending ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Register
