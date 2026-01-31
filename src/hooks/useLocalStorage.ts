import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(key)
			if (!stored) return initialValue

			const parsed = JSON.parse(stored)
			return parsed ?? initialValue
		} catch (error) {
			// Handle corrupted localStorage data gracefully - don't crash the app
			console.warn(`Failed to parse localStorage key "${key}":`, error)
			return initialValue
		}
	})

	const setStoredValue = (newValue: T) => {
		try {
			setValue(newValue)
			localStorage.setItem(key, JSON.stringify(newValue))
		} catch (error) {
			console.error(`Failed to save to localStorage key "${key}":`, error)
		}
	}

	const removeStoredValue = () => {
		try {
			setValue(initialValue)
			localStorage.removeItem(key)
		} catch (error) {
			console.error(`Failed to remove localStorage key "${key}":`, error)
		}
	}

	return { value, setStoredValue, removeStoredValue }
}
