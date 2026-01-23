import { createContext, useCallback, useMemo } from "react"
import type { AuthContextType, AuthProviderProps, User } from "@/types"
import { useLocalStorage } from "../hooks/useLocalStorage"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const {
		value: user,
		setStoredValue: setUser,
		removeStoredValue: clearUser,
	} = useLocalStorage<User | null>("user", null)

	const logout = useCallback(() => {
		clearUser()
	}, [clearUser])

	const value = useMemo(
		() => ({
			user,
			setUser,
			logout,
		}),
		[user, setUser, logout]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
