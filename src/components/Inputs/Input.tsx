import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	inputId: string
}

export default function Input({ label, inputId, className = "", ...props }: InputProps) {
	return (
		<div className="w-full">
			{label && (
				<label htmlFor={inputId} className="block mb-1 font-medium text-gray-700 text-sm">
					{label}
				</label>
			)}
			<input
				id={inputId}
				className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
				{...props}
			/>
		</div>
	)
}
