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
