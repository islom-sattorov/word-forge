import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useSessionsStore } from "../stores/sessionsStore";

export function HistoryPage() {
	const { t } = useTranslation();
	const sessions = useSessionsStore((state) => state.sessions);

	const getModeColor = (mode: string) => {
		switch (mode) {
			case "words":
				return "text-green-600 bg-green-100 dark:bg-green-900/30";
			case "verbs":
				return "text-purple-600 bg-purple-100 dark:bg-purple-900/30";
			case "custom":
				return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
			default:
				return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
		}
	};

	const getModeIcon = (mode: string) => {
		switch (mode) {
			case "words":
				return "📚";
			case "verbs":
				return "✨";
			case "custom":
				return "📝";
			default:
				return "🎯";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
			<div className="max-w-4xl mx-auto space-y-6 animate-slideDown">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
						{t("history.title")}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{sessions.length} sessions completed
					</p>
				</div>

				{/* Sessions List */}
				{sessions.length === 0 ? (
					<Card className="text-center py-12">
						<div className="text-6xl mb-4">📊</div>
						<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
							{t("history.noSessions")}
						</h3>
						<Link to="/">
							<Button variant="primary" className="mt-4">
								Start Learning
							</Button>
						</Link>
					</Card>
				) : (
					<div className="space-y-4">
						{sessions.map((session) => (
							<Card
								key={session.id}
								className="hover:shadow-lg transition-shadow"
							>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4 flex-1">
										<div className="text-4xl">{getModeIcon(session.mode)}</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span
													className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getModeColor(session.mode)}`}
												>
													{session.mode}
												</span>
												<span className="text-sm text-gray-500 dark:text-gray-400">
													{new Date(session.startTime).toLocaleDateString()}{" "}
													{new Date(session.startTime).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>

											<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
												<div>
													<p className="text-gray-600 dark:text-gray-400">
														Accuracy
													</p>
													<p className="text-lg font-bold text-green-600">
														{session.accuracy.toFixed(0)}%
													</p>
												</div>
												<div>
													<p className="text-gray-600 dark:text-gray-400">
														Score
													</p>
													<p className="text-lg font-bold text-blue-600">
														{session.correctAnswers}/{session.totalQuestions}
													</p>
												</div>
												<div>
													<p className="text-gray-600 dark:text-gray-400">
														XP Earned
													</p>
													<p className="text-lg font-bold text-orange-600">
														+{session.xpEarned}
													</p>
												</div>
												<div>
													<p className="text-gray-600 dark:text-gray-400">
														Items
													</p>
													<p className="text-lg font-bold text-purple-600">
														{session.wordsLearned.length}
													</p>
												</div>
											</div>

											{session.wordsLearned.length > 0 && (
												<div className="mt-3">
													<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
														Learned:
													</p>
													<div className="flex flex-wrap gap-2">
														{session.wordsLearned
															.slice(0, 5)
															.map((word, idx) => (
																<span
																	key={idx}
																	className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
																>
																	{word}
																</span>
															))}
														{session.wordsLearned.length > 5 && (
															<span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">
																+{session.wordsLearned.length - 5} more
															</span>
														)}
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
