import type { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
	hoverable?: boolean;
}

export function Card({
	children,
	className = "",
	onClick,
	hoverable = false,
}: CardProps) {
	const baseStyles =
		"bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700";
	const hoverStyles = hoverable
		? "hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
		: "";

	return (
		<div
			className={`${baseStyles} ${hoverStyles} ${className}`}
			onClick={onClick}
		>
			{children}
		</div>
	);
}
