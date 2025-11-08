import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { useGamificationStore } from "../../stores/gamificationStore";
import { useUserStore } from "../../stores/userStore";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	const router = useRouterState();
	const currentPath = router.location.pathname;
	const initializeFromTelegram = useUserStore(
		(state) => state.initializeFromTelegram,
	);
	const initializeGamification = useGamificationStore(
		(state) => state.initializeGamification,
	);

	// Get Telegram data
	const { theme, isReady, user: telegramUser } = useTelegram();

	// Initialize user from Telegram and gamification on mount
	useEffect(() => {
		if (isReady) {
			initializeFromTelegram(telegramUser);
			initializeGamification();
		}
	}, [isReady, telegramUser, initializeFromTelegram, initializeGamification]);

	// Apply Telegram theme
	useEffect(() => {
		if (isReady && theme) {
			// Apply theme class to document root
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	}, [isReady, theme]);

	const user = useUserStore((state) => state.user);

	const navItems = [
		{
			path: "/",
			label: "Home",
			icon: "🏠",
		},
		{
			path: "/learn/words",
			label: "Words",
			icon: "📚",
		},
		{
			path: "/learn/verbs",
			label: "Verbs",
			icon: "✨",
		},
		{
			path: "/custom-words",
			label: "My Words",
			icon: "📝",
		},
		{
			path: "/profile",
			label: "Profile",
			icon: "👤",
		},
	];

	return (
		<div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
			{/* Top Header */}
			<header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="px-4 py-3 max-w-5xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
							{user?.avatar ? (
								<img
									src={user.avatar}
									alt={user.username}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.currentTarget.style.display = "none";
										e.currentTarget.parentElement!.textContent = "👤";
									}}
								/>
							) : (
								<span className="text-white text-lg">👤</span>
							)}
						</div>
						<div>
							<h2 className="font-semibold text-gray-900 dark:text-white">
								{user?.username || "Guest"}
							</h2>
							{user?.username !== "Guest" && (
								<p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
									<span>✈️</span> Telegram
								</p>
							)}
						</div>
					</div>
					<div className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						WordForge
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 pb-20 overflow-y-auto">{children}</main>

			{/* Bottom Navigation */}
			<nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
				<div className="flex justify-around items-center px-2 py-2 max-w-5xl mx-auto">
					{navItems.map((item) => {
						const isActive = currentPath === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 scale-105" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
							>
								<span className="text-xl mb-0.5">{item.icon}</span>
								<span className="text-xs font-medium">{item.label}</span>
							</Link>
						);
					})}
				</div>
			</nav>
		</div>
	);
}
