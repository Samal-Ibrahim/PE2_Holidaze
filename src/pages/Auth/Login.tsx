import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/useAuth"
import { isValidStudentEmail } from "@/lib/validators"
import type { User } from "@/types"
import loginApi from "../../api/auth/loginApi"

const Login = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const { setUser } = useAuth()

	const { mutate, isPending } = useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			loginApi(email, password),

		onSuccess: (data) => {
			if ("user" in data) {
				toast.success("Login successful!")
				const user: User = {
					id: data.user.id,
					name: data.user.name,
					email: data.user.email,
					token: data.user.accessToken,
				}
				setUser(user)
				navigate("/profile")
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
		<div className=" h-full flex items-center justify-center p-4">
			<div className="flex flex-col gap-6 items-center justify-center">
				<h3>Login Page</h3>
				<form
					aria-label="login form"
					onSubmit={(e) => {
						e.preventDefault()
						handleLogin(e)
					}}
					className=" flex flex-col gap-4 max-w-lg min-w-md p-4"
				>
					<div className="flex flex-col w-full">
						<p className="text-red-600">{errorMessage}</p>

						<label htmlFor="email">Email:</label>
						<input
							aria-label="email-input"
							type="email"
							className=" bg-content-bg text-fg p-2 w-full"
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
							className=" bg-content-bg text-fg p-2 w-full"
							placeholder="Enter your password"
							id="password"
							name="password"
							defaultValue={"Mypassword12345"}
							minLength={8}
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
						className="bg-btn w-full hover:bg-btn-bg-hover hover:text-btn-text-hover cursor-pointer text-btn-text p-2 mt-4"
					>
						{isPending ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Login
