import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
	en: {
		translation: {
			// Navigation
			nav: {
				home: "Home",
				learn: "Learn",
				myWords: "My Words",
				stats: "Stats",
				profile: "Profile",
			},
			// Home Page
			home: {
				title: "WordForge",
				subtitle: "Expand your vocabulary, master irregular verbs",
				startLearning: "Start Learning",
				learnWords: "Learn Words",
				learnVerbs: "Learn Verbs",
				customWords: "My Custom Words",
				dailyGoal: "Daily Goal",
				xpToday: "XP Today",
				wordsToday: "Words Today",
				streak: "Day Streak",
			},
			// Learning Modes
			learn: {
				words: {
					title: "Learn Words",
					subtitle: "Choose the correct translation",
					selectAnswer: "Select the correct answer",
				},
				verbs: {
					title: "Irregular Verbs",
					subtitle: "Fill in the verb forms",
					baseForm: "Base Form",
					pastForm: "Past Form",
					participleForm: "Past Participle",
					hint: "Use Hint",
				},
			},
			// Profile
			profile: {
				title: "Profile",
				editProfile: "Edit Profile",
				username: "Username",
				avatar: "Avatar",
				stats: "Stats",
				totalXP: "Total XP",
				level: "Level",
				wordsLearned: "Words Learned",
				verbsLearned: "Verbs Learned",
				accuracy: "Average Accuracy",
				longestStreak: "Longest Streak",
				currentStreak: "Current Streak",
			},
			// Custom Words
			customWords: {
				title: "My Custom Words",
				add: "Add New Word",
				word: "Word",
				translation: "Translation",
				example: "Example (optional)",
				save: "Save",
				cancel: "Cancel",
				delete: "Delete",
				edit: "Edit",
				practice: "Practice My Words",
				noWords: "No custom words yet. Add your first word!",
				search: "Search words...",
			},
			// Mistakes
			mistakes: {
				title: "My Mistakes",
				noMistakes: "No mistakes yet. Keep learning!",
				question: "Question",
				yourAnswer: "Your Answer",
				correctAnswer: "Correct Answer",
				retry: "Retry",
				retries: "Retries",
				clear: "Clear All",
			},
			// History
			history: {
				title: "Session History",
				noSessions: "No sessions yet. Start learning!",
				mode: "Mode",
				accuracy: "Accuracy",
				questions: "Questions",
				xpEarned: "XP Earned",
				wordsLearned: "Words Learned",
				replay: "Replay Similar",
				date: "Date",
			},
			// Stats
			stats: {
				title: "Statistics",
				overview: "Overview",
				daily: "Daily Stats",
				achievements: "Achievements",
				totalSessions: "Total Sessions",
				averageAccuracy: "Average Accuracy",
				xpPerDay: "XP per Day",
			},
			// Gamification
			gamification: {
				xp: "XP",
				level: "Level",
				achievement: "Achievement Unlocked!",
				streak: "Streak",
				combo: "Combo",
				perfectRound: "Perfect Round!",
			},
			// Common
			common: {
				correct: "Correct!",
				incorrect: "Incorrect",
				next: "Next",
				back: "Back",
				submit: "Submit",
				continue: "Continue",
				finish: "Finish",
				loading: "Loading...",
				error: "Error",
				success: "Success",
				close: "Close",
			},
			// Feedback
			feedback: {
				correct: "Great job! 🎉",
				incorrect: "Not quite. Keep trying!",
				sessionComplete: "Session Complete!",
				newAchievement: "New Achievement Unlocked!",
				streakIncreased: "Streak increased to {{count}} days! 🔥",
			},
		},
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
