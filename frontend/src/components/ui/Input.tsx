import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export function Input({
	label,
	error,
	helperText,
	className = "",
	...props
}: InputProps) {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
					{label}
				</label>
			)}
			<input
				className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg
          focus:outline-none focus:ring-2 transition-all duration-200
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"}
          ${className}`}
				{...props}
			/>
			{error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
			{helperText && !error && (
				<p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
					{helperText}
				</p>
			)}
		</div>
	);
}
