import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	inputId: string
}

export default function Input({ label, inputId, className = "", ...props }: InputProps) {
	return (
		<div className="w-full p-4 bg-white shadow-md">
			{label && (
				<label htmlFor={inputId} className="block mb-1 font-medium text-gray-700 text-sm">
					{label}
				</label>
			)}
			<input
				id={inputId}
				className={`w-full px-3 bg-white py-2 border focus:outline-none focus:ring-2 focus:ring-black/50 ${className}`}
				{...props}
			/>
		</div>
	)
}
