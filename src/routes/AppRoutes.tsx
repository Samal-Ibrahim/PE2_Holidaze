import { Route, Routes, useLocation } from "react-router-dom"
import {
	CREATE_VENUE_PAGE_URL,
	LOGIN_PAGE_URL,
	PROFILE_PAGE_URL,
	REGISTER_PAGE_URL,
	VENUES_PAGE_URL,
} from "@/config/constants"
import Login from "@/pages/Auth/Login"
import Register from "@/pages/Auth/Register"
import NotFound from "@/pages/NotFound"
import EditProfile from "@/pages/Profile/components/EditProfile"
import EditVenue from "@/pages/Profile/components/EditVenues"
import Profile from "@/pages/Profile/Profile"
import Venues from "@/pages/Venues"
import CreateVenue from "@/pages/Venues/CreateVenue"
import ViewSingleVenue from "@/pages/Venues/ViewSingleVenue"
import IsLoggedIn from "@/routes/LoggedInRoute"
import ProtectedRoute from "@/routes/ProtectedRoute"
import VenueManagerRoute from "./VenueManagerRoute"

export default function AppRoutes() {
	const location = useLocation()
	// Store the location where modal was opened so we can restore it when closing
	const state = location.state as { backgroundLocation?: Location }

	return (
		<>
			{/* Background routes */}
			<Routes location={state?.backgroundLocation || location}>
				<Route path={VENUES_PAGE_URL} element={<Venues />} />
				<Route path={`${VENUES_PAGE_URL}venues/:id`} element={<ViewSingleVenue />} />

				<Route element={<IsLoggedIn />}>
					<Route path={LOGIN_PAGE_URL} element={<Login />} />
					<Route path={REGISTER_PAGE_URL} element={<Register />} />
				</Route>

				<Route element={<ProtectedRoute />}>
					<Route path={PROFILE_PAGE_URL} element={<Profile />} />

					<Route path={`${PROFILE_PAGE_URL}/edit-profile`} element={<EditProfile />} />
					<Route path={`${PROFILE_PAGE_URL}/edit-venue/:id`} element={<EditVenue />} />

					<Route element={<VenueManagerRoute />}>
						<Route path={CREATE_VENUE_PAGE_URL} element={<CreateVenue />} />
					</Route>
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>

			{/* Modal overlay routes */}
			{state?.backgroundLocation && (
				<Routes>
					<Route path={`${PROFILE_PAGE_URL}/edit-profile`} element={<EditProfile />} />
					<Route path={`${PROFILE_PAGE_URL}/edit-venue/:id`} element={<EditVenue />} />
				</Routes>
			)}
		</>
	)
}
