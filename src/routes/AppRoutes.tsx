import { Route, Routes } from "react-router-dom"
import {
	CONTACT_PAGE_URL,
	HOME_PAGE_URL,
	LOGIN_PAGE_URL,
	PROFILE_PAGE_URL,
	REGISTER_PAGE_URL,
} from "@/config/constants"
import Login from "@/pages/Auth/Login"
import Register from "@/pages/Auth/Register"
import Contact from "@/pages/Contact"
import Home from "@/pages/Home"
import NotFound from "@/pages/NotFound"
import ProfileMe from "@/pages/Profile/ProfileMe"
import ProfileUsers from "@/pages/Profile/ProfileUsers"
import IsLoggedIn from "@/routes/LoggedInRoute"
import ProtectedRoute from "@/routes/ProtectedRoute"

export default function AppRoutes() {
	return (
		<Routes>
			<Route path={HOME_PAGE_URL} element={<Home />} />
			<Route path={CONTACT_PAGE_URL} element={<Contact />} />
			<Route element={<IsLoggedIn />}>
				<Route path={LOGIN_PAGE_URL} element={<Login />} />
				<Route path={REGISTER_PAGE_URL} element={<Register />} />
			</Route>
			<Route element={<ProtectedRoute />}>
				<Route path={PROFILE_PAGE_URL} element={<ProfileMe />} />
				<Route path={`${PROFILE_PAGE_URL}/:username`} element={<ProfileUsers />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	)
}
