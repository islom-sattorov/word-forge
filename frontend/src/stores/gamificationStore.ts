import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Achievement, GamificationData } from "../types";

interface GamificationState extends GamificationData {
	addXP: (amount: number) => void;
	updateStreak: () => void;
	updateDailyProgress: (amount: number) => void;
	resetDailyProgress: () => void;
	unlockAchievement: (achievementId: string) => void;
	checkAchievements: () => void;
	initializeGamification: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
	{
		id: "first-word",
		title: "First Steps",
		description: "Learn your first word",
		icon: "🎯",
		isUnlocked: false,
		requirement: 1,
		progress: 0,
		type: "words_learned",
	},
	{
		id: "10-words",
		title: "Word Explorer",
		description: "Learn 10 words",
		icon: "📚",
		isUnlocked: false,
		requirement: 10,
		progress: 0,
		type: "words_learned",
	},
	{
		id: "100-words",
		title: "Word Master",
		description: "Learn 100 words",
		icon: "🏆",
		isUnlocked: false,
		requirement: 100,
		progress: 0,
		type: "words_learned",
	},
	{
		id: "7-day-streak",
		title: "Week Warrior",
		description: "Maintain a 7-day streak",
		icon: "🔥",
		isUnlocked: false,
		requirement: 7,
		progress: 0,
		type: "streak",
	},
	{
		id: "30-day-streak",
		title: "Month Master",
		description: "Maintain a 30-day streak",
		icon: "⭐",
		isUnlocked: false,
		requirement: 30,
		progress: 0,
		type: "streak",
	},
	{
		id: "100-verbs",
		title: "Verb Virtuoso",
		description: "Master 100 irregular verbs",
		icon: "✨",
		isUnlocked: false,
		requirement: 100,
		progress: 0,
		type: "verbs_learned",
	},
];

export const useGamificationStore = create<GamificationState>()(
	persist(
		(set) => ({
			xp: 0,
			streak: 0,
			lastActiveDate: new Date(),
			dailyGoal: 20,
			dailyProgress: 0,
			achievements: INITIAL_ACHIEVEMENTS,
			level: 1,

			addXP: (amount) =>
				set((state) => {
					const newXP = state.xp + amount;
					const newLevel = Math.floor(newXP / 100) + 1;
					return { xp: newXP, level: newLevel };
				}),

			updateStreak: () =>
				set((state) => {
					const today = new Date();
					const lastActive = new Date(state.lastActiveDate);
					const diffDays = Math.floor(
						(today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
					);

					if (diffDays === 0) {
						return state; // Same day, no change
					}
					if (diffDays === 1) {
						return { streak: state.streak + 1, lastActiveDate: today };
					}
					// More than 1 day, reset streak
					return { streak: 1, lastActiveDate: today };
				}),

			updateDailyProgress: (amount) =>
				set((state) => ({
					dailyProgress: Math.min(state.dailyProgress + amount, state.dailyGoal),
				})),

			resetDailyProgress: () => set({ dailyProgress: 0 }),

			unlockAchievement: (achievementId) =>
				set((state) => ({
					achievements: state.achievements.map((a) =>
						a.id === achievementId
							? { ...a, isUnlocked: true, unlockedAt: new Date() }
							: a,
					),
				})),

			checkAchievements: () => {
				// const state = get();
				// This will be called from other stores to update achievement progress
			},

			initializeGamification: () =>
				set((state) => {
					if (state.xp === 0 && state.achievements.length === 0) {
						return {
							...state,
							achievements: INITIAL_ACHIEVEMENTS,
							lastActiveDate: new Date(),
						};
					}
					return state;
				}),
		}),
		{
			name: "wordforge-gamification",
		},
	),
);
