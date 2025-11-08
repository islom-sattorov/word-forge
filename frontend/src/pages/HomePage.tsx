import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useGamificationStore } from "../stores/gamificationStore";
import { useUserStore } from "../stores/userStore";

export function HomePage() {
	const { t } = useTranslation();
	const user = useUserStore((state) => state.user);
	const { xp, streak, dailyGoal, dailyProgress, level } =
		useGamificationStore();

	const todayXP = dailyProgress * 10; // Simple calculation for demo

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
			<div className="max-w-4xl mx-auto space-y-6 animate-slideDown">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
						{t("home.title")}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{t("home.subtitle")}
					</p>
				</div>

				{/* Welcome Card */}
				<Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold mb-1">
								Welcome back, {user?.username}! 👋
							</h2>
							<p className="text-blue-100">
								Ready to level up your vocabulary?
							</p>
						</div>
						<div className="text-right">
							<div className="text-3xl font-bold">🔥 {streak}</div>
							<p className="text-sm text-blue-100">{t("home.streak")}</p>
						</div>
					</div>
				</Card>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 gap-4">
					<Card>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600 mb-1">
								{todayXP}
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{t("home.xpToday")}
							</p>
						</div>
					</Card>
					<Card>
						<div className="text-center">
							<div className="text-3xl font-bold text-purple-600 mb-1">
								Level {level}
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{xp} XP
							</p>
						</div>
					</Card>
				</div>

				{/* Daily Goal */}
				<Card>
					<h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
						{t("home.dailyGoal")}
					</h3>
					<ProgressBar
						current={dailyProgress}
						max={dailyGoal}
						color="orange"
						size="lg"
						showPercentage
					/>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
						{dailyProgress} / {dailyGoal} words completed today
					</p>
				</Card>

				{/* Learning Modes */}
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
						{t("home.startLearning")}
					</h2>
					<div className="flex flex-col gap-2">
						<Link to="/learn/words">
							<Card
								hoverable
								className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="text-5xl">📚</div>
										<div>
											<h3 className="text-xl font-bold text-gray-800 dark:text-white">
												{t("home.learnWords")}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Choose the correct translation
											</p>
										</div>
									</div>
									<div className="text-green-600 dark:text-green-400 text-2xl">
										→
									</div>
								</div>
							</Card>
						</Link>

						<Link to="/learn/verbs">
							<Card
								hoverable
								className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="text-5xl">✨</div>
										<div>
											<h3 className="text-xl font-bold text-gray-800 dark:text-white">
												{t("home.learnVerbs")}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Master irregular verb forms
											</p>
										</div>
									</div>
									<div className="text-purple-600 dark:text-purple-400 text-2xl">
										→
									</div>
								</div>
							</Card>
						</Link>

						<Link to="/custom-words">
							<Card
								hoverable
								className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="text-5xl">📝</div>
										<div>
											<h3 className="text-xl font-bold text-gray-800 dark:text-white">
												{t("home.customWords")}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Practice your own words
											</p>
										</div>
									</div>
									<div className="text-orange-600 dark:text-orange-400 text-2xl">
										→
									</div>
								</div>
							</Card>
						</Link>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-2 gap-4">
					<Link to="/mistakes">
						<Button variant="outline" fullWidth className="h-20">
							<div className="text-center">
								<div className="text-2xl mb-1">❌</div>
								<div className="text-sm">Review Mistakes</div>
							</div>
						</Button>
					</Link>
					<Link to="/history">
						<Button variant="outline" fullWidth className="h-20">
							<div className="text-center">
								<div className="text-2xl mb-1">📊</div>
								<div className="text-sm">View History</div>
							</div>
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
