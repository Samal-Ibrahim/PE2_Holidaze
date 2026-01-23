import { createContext, useContext, useMemo, useState } from "react"
import type { EditToggleContextType, EditToggleProviderProps } from "@/types"

export const EditToggleContext = createContext<EditToggleContextType | undefined>(undefined)

export const useEditToggle = () => {
	const context = useContext(EditToggleContext)
	if (!context) {
		throw new Error("useEditToggle must be used within a EditToggleProvider")
	}
	return context
}

export const EditToggleProvider = ({ children }: EditToggleProviderProps) => {
	const [isEditOpen, setEditOpen] = useState(false)
	const value = useMemo(
		() => ({
			isEditOpen,
			setEditOpen,
		}),
		[isEditOpen]
	)
	return <EditToggleContext.Provider value={value}>{children}</EditToggleContext.Provider>
}
