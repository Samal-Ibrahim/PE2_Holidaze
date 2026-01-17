import type { ReactNode } from "react"
import type { User } from "./user"

// Auth Context Types
export type AuthContextType = {
	user: User | null
	setUser: (user: User | null) => void
	logout: () => void
}

export type AuthProviderProps = {
	children: ReactNode
}

// MenuToggle Context Types
export type MenuToggleContextType = {
	isMenuOpen: boolean
	setMenuOpen: (value: boolean) => void
}

export type MenuToggleProviderProps = {
	children: ReactNode
}
