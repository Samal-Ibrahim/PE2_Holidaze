import { createContext, useContext, useMemo, useState } from "react"
import type { MenuToggleContextType, MenuToggleProviderProps } from "@/types"

export const MenuToggleContext = createContext<MenuToggleContextType | undefined>(undefined)

export const useMenuToggle = () => {
	const context = useContext(MenuToggleContext)
	if (!context) {
		throw new Error("useMenuToggle must be used within a MenuToggleProvider")
	}
	return context
}

export const MenuToggleProvider = ({ children }: MenuToggleProviderProps) => {
	const [isMenuOpen, setMenuOpen] = useState(false)
	const value = useMemo(
		() => ({
			isMenuOpen,
			setMenuOpen,
		}),
		[isMenuOpen]
	)
	return <MenuToggleContext.Provider value={value}>{children}</MenuToggleContext.Provider>
}
