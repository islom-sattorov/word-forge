interface ProgressBarProps {
	current: number;
	max: number;
	label?: string;
	showPercentage?: boolean;
	color?: "blue" | "green" | "orange" | "purple";
	size?: "sm" | "md" | "lg";
}

export function ProgressBar({
	current,
	max,
	label,
	showPercentage = false,
	color = "blue",
	size = "md",
}: ProgressBarProps) {
	const percentage = Math.min((current / max) * 100, 100);

	const colors = {
		blue: "bg-gradient-to-r from-blue-500 to-blue-600",
		green: "bg-gradient-to-r from-green-500 to-green-600",
		orange: "bg-gradient-to-r from-orange-500 to-orange-600",
		purple: "bg-gradient-to-r from-purple-500 to-purple-600",
	};

	const sizes = {
		sm: "h-2",
		md: "h-3",
		lg: "h-4",
	};

	return (
		<div className="w-full">
			{label && (
				<div className="flex justify-between mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
					<span>{label}</span>
					{showPercentage && <span>{Math.round(percentage)}%</span>}
				</div>
			)}
			<div
				className={`w-full ${sizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
			>
				<div
					className={`${sizes[size]} ${colors[color]} transition-all duration-500 ease-out rounded-full`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}
