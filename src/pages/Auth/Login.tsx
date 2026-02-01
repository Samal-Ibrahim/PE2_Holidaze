import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { fetchProfile } from "@/api/profiles/holidazeProfileApi"
import { useAuth } from "@/hooks/useAuth"
import { isValidStudentEmail } from "@/lib/validators"
import type { User } from "@/types"
import { login } from "../../api/auth/loginApi"

const Login = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const { setUser } = useAuth()

	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			login(email, password),

		onSuccess: async (data) => {
			if ("user" in data) {
				toast.success("Login successful!")
				const user: User = {
					id: data.user.id || data.user.name,
					name: data.user.name,
					email: data.user.email,
					token: data.user.accessToken,
				}
				setUser(user)

				await queryClient.prefetchQuery({
					queryKey: ["profile", user.name],
					queryFn: () => fetchProfile(user.name),

					staleTime: 5 * 60 * 1000, // 5 minutes
					gcTime: 10 * 60 * 1000, // 10 minutes
				})
				navigate("/")
			} else {
				setErrorMessage(data.errors.map((err) => err.message).join(", "))
			}
		},
		onError: (error) => {
			setErrorMessage(error instanceof Error ? error.message : "Login failed")
		},
	})

	const navigate = useNavigate()
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(e.currentTarget)
		const email = formData.get("email") as string
		const password = formData.get("password") as string

		if (isValidStudentEmail(email) === false) {
			setErrorMessage("Email must end with @stud.noroff.no!")
			return
		}

		mutate({ email, password })
	}

	return (
		<div className="flex items-center justify-center p-2 h-full">
			<div className="flex flex-col gap-6 items-center justify-center bg-white p-4 shadow">
				<h3>Login Page</h3>
				<form
					aria-label="login form"
					onSubmit={(e) => {
						e.preventDefault()
						handleLogin(e)
					}}
					className="flex flex-col gap-4 xs:w-120 xs:p-6 2xs:w-[20rem]"
				>
					{errorMessage && <p className="text-red-600">{errorMessage}</p>}

					<div className="flex flex-col w-full">
						<label htmlFor="email">Email:</label>
						<input
							aria-label="email-input"
							type="email"
							className=" text-fg p-2 w-full bg-gray-100"
							placeholder="Enter your email"
							required
							id="email"
							name="email"
							defaultValue={"samibr02737@stud.noroff.no"}
						/>
					</div>
					<div className="flex flex-col w-full">
						<label htmlFor="password">Password:</label>
						<input
							aria-label="password-input"
							type="password"
							className=" text-fg p-2 w-full bg-gray-100"
							placeholder="Enter your password"
							id="password"
							name="password"
							defaultValue={"Mypassword12345"}
							minLength={8}
							required
						/>
					</div>
					<div className="flex gap-1 items-center">
						<p className="text-sm">Don't have an account?</p>
						<Link to="/register" className="font-bold text-sm hover:underline">
							Register here
						</Link>
					</div>
					<button
						type="submit"
						className="w-full mt-4 p-2 text-btn-text bg-btn transition-colors cursor-pointer hover:bg-btn-bg-hover hover:text-btn-text-hover"
					>
						{isPending ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Login
