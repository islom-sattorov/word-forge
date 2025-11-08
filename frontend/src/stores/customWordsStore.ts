import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomWord } from "../types";

interface CustomWordsState {
	customWords: CustomWord[];
	addCustomWord: (word: Omit<CustomWord, "id" | "createdAt">) => void;
	updateCustomWord: (id: string, updates: Partial<CustomWord>) => void;
	deleteCustomWord: (id: string) => void;
	searchCustomWords: (query: string) => CustomWord[];
}

export const useCustomWordsStore = create<CustomWordsState>()(
	persist(
		(set, get) => ({
			customWords: [],

			addCustomWord: (word) =>
				set((state) => ({
					customWords: [
						...state.customWords,
						{
							...word,
							id: crypto.randomUUID(),
							createdAt: new Date(),
						},
					],
				})),

			updateCustomWord: (id, updates) =>
				set((state) => ({
					customWords: state.customWords.map((w) =>
						w.id === id ? { ...w, ...updates } : w,
					),
				})),

			deleteCustomWord: (id) =>
				set((state) => ({
					customWords: state.customWords.filter((w) => w.id !== id),
				})),

			searchCustomWords: (query) => {
				const state = get();
				const lowerQuery = query.toLowerCase();
				return state.customWords.filter(
					(w) =>
						w.word.toLowerCase().includes(lowerQuery) ||
						w.translation.toLowerCase().includes(lowerQuery),
				);
			},
		}),
		{
			name: "wordforge-custom-words",
		},
	),
);
