import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "success" | "danger" | "outline";
	size?: "sm" | "md" | "lg";
	children: ReactNode;
	fullWidth?: boolean;
}

export function Button({
	variant = "primary",
	size = "md",
	children,
	fullWidth = false,
	className = "",
	disabled,
	...props
}: ButtonProps) {
	const baseStyles =
		"rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

	const variants = {
		primary:
			"bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md",
		secondary:
			"bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-md",
		success:
			"bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md",
		danger:
			"bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md",
		outline:
			"border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950",
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-5 py-2.5 text-base",
		lg: "px-7 py-3.5 text-lg",
	};

	const widthClass = fullWidth ? "w-full" : "";

	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
}
