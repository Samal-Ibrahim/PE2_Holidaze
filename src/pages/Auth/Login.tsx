import { Link } from "react-router-dom"
import login_api from "../../api/auth/login"

const Login = () => {

const handleLogin = async () => {
  const email = (
    document.querySelector<HTMLInputElement>("#email")?.value ?? ""
  ).trim();

  const password =
    document.querySelector<HTMLInputElement>("#password")?.value ?? "";

try {
	const response = await login_api(email, password);
	console.log("Login successful:", response);
	// Handle successful login (e.g., store token, redirect)
} catch (error) {
	
	// Handle login error (e.g., show error message)
	
}


};

	return (
		<div className=" h-full flex items-center justify-center p-4">
			<div className="flex flex-col gap-6 items-center justify-center">
				<h3>Login Page</h3>
				<form className=" flex flex-col gap-4 max-w-lg min-w-md p-4">
					<div className="flex flex-col w-full">
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							className=" bg-content-bg text-fg p-2 w-full"
							placeholder="Enter your email"
							id="email"
							name="email"
						/>
						<p className="text-red-600">Please enter a valid email address.</p>
					</div>
					<div className="flex flex-col w-full">
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							className=" bg-content-bg text-fg p-2 w-full"
							placeholder="Enter your password"
							id="password"
							name="password"
							minLength={8}
						/>
						<p className="text-red-600">Password must be at least 8 characters long.</p>
					</div>
					<div className="flex gap-1 items-center">
						<p className="text-sm">Don't have an account?</p>
						<Link to="/register" className="font-bold text-sm hover:underline">
							Register here
						</Link>
					</div>
				</form>
				<button
					type="button"
					className="bg-btn w-full hover:bg-btn-bg-hover hover:text-btn-text-hover cursor-pointer text-btn-text p-2 mt-4"
					onClick={handleLogin}
						
				>
					Login
				</button>
			</div>
		</div>
	)
}

export default Login
