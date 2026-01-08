import { Route, Routes } from "react-router-dom";
import {
	CHECKOUT_PAGE_URL,
	CONTACT_PAGE_URL,
	HOME_PAGE_URL,
} from "@/config/constants";
import Checkout from "@/pages/Checkout/";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path={HOME_PAGE_URL} element={<Home />} />
			<Route path={CONTACT_PAGE_URL} element={<Contact />} />
			<Route path={CHECKOUT_PAGE_URL} element={<Checkout />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

