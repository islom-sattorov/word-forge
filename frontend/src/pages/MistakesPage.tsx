import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useMistakesStore } from "../stores/mistakesStore";

export function MistakesPage() {
	const { t } = useTranslation();
	const { mistakes, removeMistake, clearAllMistakes, incrementRetry } =
		useMistakesStore();

	const handleRetry = (mistakeId: string) => {
		incrementRetry(mistakeId);
		// In a real implementation, this would navigate to a retry quiz with this specific item
		alert(
			"Retry feature will navigate to a practice session with this word/verb!",
		);
	};

	const handleClearAll = () => {
		if (confirm("Are you sure you want to clear all mistakes?")) {
			clearAllMistakes();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
			<div className="max-w-4xl mx-auto space-y-6 animate-slideDown">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
							{t("mistakes.title")}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							{mistakes.length} mistakes to review
						</p>
					</div>
					{mistakes.length > 0 && (
						<Button variant="danger" onClick={handleClearAll}>
							{t("mistakes.clear")}
						</Button>
					)}
				</div>

				{/* Mistakes List */}
				{mistakes.length === 0 ? (
					<Card className="text-center py-12">
						<div className="text-6xl mb-4">🎉</div>
						<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
							{t("mistakes.noMistakes")}
						</h3>
					</Card>
				) : (
					<div className="space-y-4">
						{/* Group by type */}
						{["word", "verb"].map((type) => {
							const typeMistakes = mistakes.filter((m) => m.type === type);
							if (typeMistakes.length === 0) return null;

							return (
								<div key={type}>
									<h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 capitalize">
										{type}s ({typeMistakes.length})
									</h2>
									<div className="grid gap-3">
										{typeMistakes.map((mistake) => (
											<Card
												key={mistake.id}
												className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10"
											>
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<span className="text-2xl">
																{type === "word" ? "📚" : "✨"}
															</span>
															<h3 className="text-lg font-bold text-gray-800 dark:text-white">
																{mistake.question}
															</h3>
														</div>
														<div className="space-y-1 text-sm">
															<p className="text-red-600 dark:text-red-400">
																<span className="font-semibold">
																	{t("mistakes.yourAnswer")}:
																</span>{" "}
																{mistake.userAnswer || "(empty)"}
															</p>
															<p className="text-green-600 dark:text-green-400">
																<span className="font-semibold">
																	{t("mistakes.correctAnswer")}:
																</span>{" "}
																{mistake.correctAnswer}
															</p>
															<p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
																{new Date(
																	mistake.timestamp,
																).toLocaleDateString()}{" "}
																• {t("mistakes.retries")}: {mistake.retryCount}
															</p>
														</div>
													</div>
													<div className="flex flex-col gap-2 ml-4">
														<Button
															variant="primary"
															size="sm"
															onClick={() => handleRetry(mistake.id)}
														>
															{t("mistakes.retry")}
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => removeMistake(mistake.id)}
														>
															Remove
														</Button>
													</div>
												</div>
											</Card>
										))}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
