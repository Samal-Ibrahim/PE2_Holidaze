import { useState } from "react"

export function useLocalStorage<T>(user: string, initialValue: T) {
	const [value, setValue] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(user)

			return stored ? JSON.parse(stored) : initialValue
		} catch {
			return initialValue
		}
	})

	const setStoredValue = (newValue: T) => {
		setValue(newValue)
		localStorage.setItem(user, JSON.stringify(newValue))
	}

	const removeStoredValue = () => {
		setValue(initialValue)
		localStorage.removeItem(user)
	}

	return { value, setStoredValue, removeStoredValue }
}
