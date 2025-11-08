import { type ReactNode, useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg";
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	size = "md",
}: ModalProps) {
	// Close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const sizes = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-2xl",
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
			onClick={onClose}
		>
			<div
				className={`w-full ${sizes[size]} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
          animate-slideUp overflow-hidden`}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							{title}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                transition-colors duration-200 text-2xl leading-none"
						>
							×
						</button>
					</div>
				)}
				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	);
}
