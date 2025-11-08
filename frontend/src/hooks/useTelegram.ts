import type { User as TelegramUser } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

interface TelegramData {
	user: TelegramUser | null;
	initDataRaw: string | null;
	theme: "light" | "dark";
	isReady: boolean;
}

/**
 * Hook to access Telegram Mini App SDK data
 * Provides user info, theme, and initialization status
 */
export function useTelegram(): TelegramData {
	const [telegramData, setTelegramData] = useState<TelegramData>({
		user: null,
		initDataRaw: null,
		theme: "light",
		isReady: false,
	});

	useEffect(() => {
		// Try to access Telegram WebApp API
		const initTelegram = () => {
			try {
				// Check if Telegram WebApp is available
				if (typeof window !== "undefined" && window.Telegram?.WebApp) {
					const tg = window.Telegram.WebApp;

					console.group("🔍 Telegram WebApp Debugging");
					console.log("✅ Telegram WebApp found");
					console.log("📱 Platform:", tg.platform);
					console.log("🎨 Version:", tg.version);
					console.log("🔗 InitData (raw):", tg.initData);
					console.log("📦 InitDataUnsafe:", tg.initDataUnsafe);
					console.log("👤 User from initDataUnsafe:", tg.initDataUnsafe?.user);
					console.log("🎨 ColorScheme:", tg.colorScheme);
					console.log("🌐 Full WebApp object:", tg);
					console.groupEnd();

					// Get user data from initDataUnsafe
					let user = (tg.initDataUnsafe?.user as TelegramUser) ?? null;

					// If initDataUnsafe is empty, check if we can create a mock user from available data
					if (!user && tg.initDataUnsafe) {
						console.warn(
							"⚠️ InitDataUnsafe exists but user is empty. This means the app is not launched properly from Telegram bot.",
						);
						console.log(
							"ℹ️ Available initDataUnsafe keys:",
							Object.keys(tg.initDataUnsafe),
						);
					}

					// Get theme from colorScheme
					const isDark = tg.colorScheme === "dark";
					const theme = isDark ? "dark" : "light";

					// Expand viewport to full height
					tg.expand();

					// Signal that the app is ready
					tg.ready();

					setTelegramData({
						user,
						initDataRaw: tg.initData || null,
						theme,
						isReady: true,
					});

					if (user) {
						console.log("✅ Telegram integration successful with user data");
					} else {
						console.warn(
							"⚠️ Telegram WebApp loaded but NO USER DATA. You need to launch this app through a Telegram bot with proper web_app button.",
						);
					}
				} else {
					// Not in Telegram environment
					console.warn(
						"❌ Not in Telegram environment - window.Telegram.WebApp not available",
					);
					setTelegramData({
						user: null,
						initDataRaw: null,
						theme: "light",
						isReady: true,
					});
				}
			} catch (error) {
				console.error("❌ Error initializing Telegram WebApp:", error);
				setTelegramData({
					user: null,
					initDataRaw: null,
					theme: "light",
					isReady: true,
				});
			}
		};

		// Small delay to ensure Telegram script is loaded
		const timer = setTimeout(initTelegram, 100);

		return () => clearTimeout(timer);
	}, []);

	return telegramData;
}

// Extend window interface for Telegram WebApp
declare global {
	interface Window {
		Telegram?: {
			WebApp: {
				initData: string;
				initDataUnsafe: {
					user?: TelegramUser;
					[key: string]: unknown;
				};
				colorScheme: "light" | "dark";
				expand: () => void;
				ready: () => void;
			};
		};
	}
}
