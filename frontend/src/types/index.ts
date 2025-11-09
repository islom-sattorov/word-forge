// User Profile Types
export interface User {
	id: string;
	username: string;
	avatar?: string;
	createdAt: Date;
	lastActiveDate: Date;
}

// Word Types
export interface Word {
	id: string;
	word: string;
	translation: string;
	difficulty: "easy" | "medium" | "hard";
	partOfSpeech: string;
	example?: string;
	category?: string;
}

// Irregular Verb Types
export interface Verb {
	id: string;
	base: string;
	past: string;
	participle: string;
	translation: string;
	difficulty: "easy" | "medium" | "hard";
	examples?: string[];
}

// Custom Word Types
export interface CustomWord {
	id: string;
	word: string;
	translation: string;
	example?: string;
	createdAt: Date;
}

// Gamification Types
export interface GamificationData {
	xp: number;
	streak: number;
	lastActiveDate: Date;
	dailyGoal: number;
	dailyProgress: number;
	achievements: Achievement[];
	level: number;
}

export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	unlockedAt?: Date;
	isUnlocked: boolean;
	requirement: number;
	progress: number;
	type: "streak" | "words_learned" | "verbs_learned" | "accuracy" | "xp";
}

// Mistake Tracking Types
export interface Mistake {
	id: string;
	type: "word" | "verb";
	questionId: string; // ID of the word or verb
	question: string; // The word/verb that was shown
	userAnswer: string;
	correctAnswer: string;
	timestamp: Date;
	retryCount: number;
}

// Session Types
export interface Session {
	id: string;
	mode: "words" | "verbs" | "custom";
	startTime: Date;
	endTime?: Date;
	accuracy: number;
	totalQuestions: number;
	correctAnswers: number;
	xpEarned: number;
	wordsLearned: string[];
}

// Quiz Question Types
export interface WordQuestion {
	id: string;
	word: Word;
	options: string[];
	correctAnswer: string;
}

export interface VerbQuestion {
	id: string;
	verb: Verb;
}

// Stats Types
export interface DailyStats {
	date: Date;
	xpEarned: number;
	wordsLearned: number;
	verbsLearned: number;
	sessionsCompleted: number;
	accuracy: number;
}

export interface OverallStats {
	totalXP: number;
	totalWordsLearned: number;
	totalVerbsLearned: number;
	totalSessions: number;
	averageAccuracy: number;
	longestStreak: number;
	currentStreak: number;
	dailyStats: DailyStats[];
}

// Answer Types
export type AnswerResult = "correct" | "incorrect";

export interface QuizAnswer {
	questionId: string;
	userAnswer: string;
	correctAnswer: string;
	result: AnswerResult;
	xpEarned: number;
	comboCount?: number;
}
