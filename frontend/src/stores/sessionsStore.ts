import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session } from "../types";

interface SessionsState {
	sessions: Session[];
	currentSession: Session | null;
	startSession: (mode: "words" | "verbs" | "custom") => void;
	endSession: (
		correctAnswers: number,
		totalQuestions: number,
		xpEarned: number,
		wordsLearned: string[],
	) => void;
	getRecentSessions: (limit?: number) => Session[];
	getSessionsByMode: (mode: "words" | "verbs" | "custom") => Session[];
}

export const useSessionsStore = create<SessionsState>()(
	persist(
		(set, get) => ({
			sessions: [],
			currentSession: null,

			startSession: (mode) =>
				set({
					currentSession: {
						id: crypto.randomUUID(),
						mode,
						startTime: new Date(),
						accuracy: 0,
						totalQuestions: 0,
						correctAnswers: 0,
						xpEarned: 0,
						wordsLearned: [],
					},
				}),

			endSession: (correctAnswers, totalQuestions, xpEarned, wordsLearned) =>
				set((state) => {
					if (!state.currentSession) return state;

					const accuracy =
						totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

					const completedSession: Session = {
						...state.currentSession,
						endTime: new Date(),
						correctAnswers,
						totalQuestions,
						accuracy,
						xpEarned,
						wordsLearned,
					};

					return {
						sessions: [completedSession, ...state.sessions],
						currentSession: null,
					};
				}),

			getRecentSessions: (limit = 10) => {
				const state = get();
				return state.sessions.slice(0, limit);
			},

			getSessionsByMode: (mode) => {
				const state = get();
				return state.sessions.filter((s) => s.mode === mode);
			},
		}),
		{
			name: "wordforge-sessions",
		},
	),
);
