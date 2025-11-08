import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User as TelegramUser } from "@telegram-apps/sdk-react";
import type { User } from "../types";

interface UserState {
	user: User | null;
	setUser: (user: User) => void;
	updateUser: (updates: Partial<User>) => void;
	initializeUser: () => void;
	initializeFromTelegram: (telegramUser: TelegramUser | null) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,

			setUser: (user) => set({ user }),

			updateUser: (updates) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...updates } : null,
				})),

			initializeUser: () =>
				set((state) => {
					if (!state.user) {
						const newUser: User = {
							id: crypto.randomUUID(),
							username: "Guest",
							createdAt: new Date(),
							lastActiveDate: new Date(),
						};
						return { user: newUser };
					}
					return state;
				}),

			initializeFromTelegram: (telegramUser: TelegramUser | null) =>
				set((state) => {
					try {
						if (telegramUser) {
							// Create user from Telegram data
							const newUser: User = {
								id: telegramUser.id.toString(),
								username:
									telegramUser.username ||
									telegramUser.first_name ||
									`User${telegramUser.id}`,
								avatar: telegramUser.photo_url,
								createdAt: state.user?.createdAt || new Date(),
								lastActiveDate: new Date(),
							};
							return { user: newUser };
						}

						// Fallback to existing user or create guest
						if (!state.user) {
							const newUser: User = {
								id: crypto.randomUUID(),
								username: "Guest",
								createdAt: new Date(),
								lastActiveDate: new Date(),
							};
							return { user: newUser };
						}
					} catch (error) {
						console.warn("Failed to initialize from Telegram:", error);

						// Fallback to guest user
						if (!state.user) {
							const newUser: User = {
								id: crypto.randomUUID(),
								username: "Guest",
								createdAt: new Date(),
								lastActiveDate: new Date(),
							};
							return { user: newUser };
						}
					}

					return state;
				}),
		}),
		{
			name: "wordforge-user",
		},
	),
);
