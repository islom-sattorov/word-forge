import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Mistake } from "../types";

interface MistakesState {
	mistakes: Mistake[];
	addMistake: (mistake: Omit<Mistake, "id" | "timestamp" | "retryCount">) => void;
	incrementRetry: (mistakeId: string) => void;
	removeMistake: (mistakeId: string) => void;
	clearAllMistakes: () => void;
	getMistakesByType: (type: "word" | "verb") => Mistake[];
}

export const useMistakesStore = create<MistakesState>()(
	persist(
		(set, get) => ({
			mistakes: [],

			addMistake: (mistake) =>
				set((state) => ({
					mistakes: [
						...state.mistakes,
						{
							...mistake,
							id: crypto.randomUUID(),
							timestamp: new Date(),
							retryCount: 0,
						},
					],
				})),

			incrementRetry: (mistakeId) =>
				set((state) => ({
					mistakes: state.mistakes.map((m) =>
						m.id === mistakeId ? { ...m, retryCount: m.retryCount + 1 } : m,
					),
				})),

			removeMistake: (mistakeId) =>
				set((state) => ({
					mistakes: state.mistakes.filter((m) => m.id !== mistakeId),
				})),

			clearAllMistakes: () => set({ mistakes: [] }),

			getMistakesByType: (type) => {
				const state = get();
				return state.mistakes.filter((m) => m.type === type);
			},
		}),
		{
			name: "wordforge-mistakes",
		},
	),
);
