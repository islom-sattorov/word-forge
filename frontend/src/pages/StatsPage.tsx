import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useGamificationStore } from "../stores/gamificationStore";
import { useSessionsStore } from "../stores/sessionsStore";

export function StatsPage() {
	const { t } = useTranslation();
	const { xp, streak, level, dailyGoal, dailyProgress } =
		useGamificationStore();
	const sessions = useSessionsStore((state) => state.sessions);

	const totalSessions = sessions.length;
	const averageAccuracy =
		sessions.length > 0
			? sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
			: 0;

	const wordsLearned = sessions
		.filter((s) => s.mode === "words")
		.reduce((sum, s) => sum + s.wordsLearned.length, 0);

	const verbsLearned = sessions
		.filter((s) => s.mode === "verbs")
		.reduce((sum, s) => sum + s.wordsLearned.length, 0);

	const totalXPEarned = sessions.reduce((sum, s) => sum + s.xpEarned, 0);

	// Calculate stats by mode
	const wordsSessions = sessions.filter((s) => s.mode === "words");
	const verbsSessions = sessions.filter((s) => s.mode === "verbs");

	const wordsAccuracy =
		wordsSessions.length > 0
			? wordsSessions.reduce((sum, s) => sum + s.accuracy, 0) /
				wordsSessions.length
			: 0;

	const verbsAccuracy =
		verbsSessions.length > 0
			? verbsSessions.reduce((sum, s) => sum + s.accuracy, 0) /
				verbsSessions.length
			: 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
			<div className="max-w-4xl mx-auto space-y-6 animate-slideDown">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
						{t("stats.title")}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Your learning statistics and progress
					</p>
				</div>

				{/* Daily Progress */}
				<Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
					<h3 className="text-xl font-bold mb-3">Today's Progress</h3>
					<ProgressBar
						current={dailyProgress}
						max={dailyGoal}
						label={`${dailyProgress} / ${dailyGoal} words`}
						showPercentage
						color="blue"
					/>
				</Card>

				{/* Overview Stats */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<Card className="text-center">
						<div className="text-3xl mb-2">🎯</div>
						<div className="text-2xl font-bold text-blue-600">{xp}</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
					</Card>
					<Card className="text-center">
						<div className="text-3xl mb-2">🔥</div>
						<div className="text-2xl font-bold text-orange-600">{streak}</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Day Streak
						</p>
					</Card>
					<Card className="text-center">
						<div className="text-3xl mb-2">⭐</div>
						<div className="text-2xl font-bold text-yellow-600">{level}</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
					</Card>
					<Card className="text-center">
						<div className="text-3xl mb-2">📊</div>
						<div className="text-2xl font-bold text-green-600">
							{totalSessions}
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
					</Card>
				</div>

				{/* Learning Stats */}
				<Card>
					<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
						Learning Progress
					</h3>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between mb-2">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Words Learned
								</span>
								<span className="text-sm font-bold text-green-600">
									{wordsLearned}
								</span>
							</div>
							<ProgressBar
								current={wordsLearned}
								max={Math.max(wordsLearned, 100)}
								color="green"
							/>
						</div>

						<div>
							<div className="flex justify-between mb-2">
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Verbs Mastered
								</span>
								<span className="text-sm font-bold text-purple-600">
									{verbsLearned}
								</span>
							</div>
							<ProgressBar
								current={verbsLearned}
								max={Math.max(verbsLearned, 100)}
								color="purple"
							/>
						</div>
					</div>
				</Card>

				{/* Accuracy Stats */}
				<Card>
					<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
						Accuracy by Mode
					</h3>
					<div className="grid sm:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<div className="text-4xl mb-2">📚</div>
							<div className="text-2xl font-bold text-green-600">
								{wordsAccuracy.toFixed(0)}%
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Words
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
								{wordsSessions.length} sessions
							</p>
						</div>
						<div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<div className="text-4xl mb-2">✨</div>
							<div className="text-2xl font-bold text-purple-600">
								{verbsAccuracy.toFixed(0)}%
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Verbs
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
								{verbsSessions.length} sessions
							</p>
						</div>
						<div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<div className="text-4xl mb-2">🎯</div>
							<div className="text-2xl font-bold text-blue-600">
								{averageAccuracy.toFixed(0)}%
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Overall
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
								{totalSessions} sessions
							</p>
						</div>
					</div>
				</Card>

				{/* XP Stats */}
				<Card>
					<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
						Experience Points
					</h3>
					<div className="grid grid-cols-2 gap-6">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
								Total XP Earned
							</p>
							<p className="text-3xl font-bold text-orange-600">
								{totalXPEarned}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
								Average XP/Session
							</p>
							<p className="text-3xl font-bold text-blue-600">
								{totalSessions > 0
									? Math.round(totalXPEarned / totalSessions)
									: 0}
							</p>
						</div>
					</div>
					<div className="mt-4">
						<ProgressBar
							current={xp % 100}
							max={100}
							label={`Progress to Level ${level + 1}`}
							showPercentage
							color="orange"
						/>
					</div>
				</Card>
			</div>
		</div>
	);
}
