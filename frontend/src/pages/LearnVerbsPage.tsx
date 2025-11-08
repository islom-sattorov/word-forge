// import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";
import { getRandomVerbs } from "../constants/sampleData";
import { useGamificationStore } from "../stores/gamificationStore";
import { useMistakesStore } from "../stores/mistakesStore";
import { useSessionsStore } from "../stores/sessionsStore";
import type { Verb } from "../types";

const QUESTIONS_PER_SESSION = 10;
const XP_PER_CORRECT = 15; // Higher XP for verbs as they're harder
const HINT_PENALTY = 5;

export function LearnVerbsPage() {
	// const { t } = useTranslation();
	const [verbs, setVerbs] = useState<Verb[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [pastInput, setPastInput] = useState("");
	const [participleInput, setParticipleInput] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isPastCorrect, setIsPastCorrect] = useState<boolean | null>(null);
	const [isParticipleCorrect, setIsParticipleCorrect] = useState<
		boolean | null
	>(null);
	const [score, setScore] = useState(0);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [hintsUsed, setHintsUsed] = useState(0);
	const [showHint, setShowHint] = useState(false);

	const addXP = useGamificationStore((state) => state.addXP);
	const updateStreak = useGamificationStore((state) => state.updateStreak);
	const updateDailyProgress = useGamificationStore(
		(state) => state.updateDailyProgress,
	);
	const addMistake = useMistakesStore((state) => state.addMistake);
	const startSession = useSessionsStore((state) => state.startSession);
	const endSession = useSessionsStore((state) => state.endSession);

	useEffect(() => {
		initializeQuestions();
	}, []);

	const initializeQuestions = () => {
		const randomVerbs = getRandomVerbs(QUESTIONS_PER_SESSION);
		setVerbs(randomVerbs);
		setSessionStarted(true);
		startSession("verbs");
	};

	const normalizeAnswer = (answer: string) => {
		return answer.toLowerCase().trim();
	};

	const checkAnswer = (userAnswer: string, correctAnswer: string) => {
		const normalized = normalizeAnswer(userAnswer);
		const correct = normalizeAnswer(correctAnswer);

		// Handle cases like "got/gotten" or "was/were"
		if (correct.includes("/")) {
			const options = correct.split("/");
			return options.some((opt) => opt.trim() === normalized);
		}

		return normalized === correct;
	};

	const handleSubmit = () => {
		if (isSubmitted) return;

		const currentVerb = verbs[currentIndex];
		const pastCorrect = checkAnswer(pastInput, currentVerb.past);
		const participleCorrect = checkAnswer(
			participleInput,
			currentVerb.participle,
		);

		setIsPastCorrect(pastCorrect);
		setIsParticipleCorrect(participleCorrect);
		setIsSubmitted(true);

		const bothCorrect = pastCorrect && participleCorrect;

		if (bothCorrect) {
			setScore(score + 1);
			const earnedXP = XP_PER_CORRECT - (showHint ? HINT_PENALTY : 0);
			addXP(earnedXP);
			updateDailyProgress(1);
		} else {
			if (!pastCorrect) {
				addMistake({
					type: "verb",
					questionId: currentVerb.id,
					question: `${currentVerb.base} (past)`,
					userAnswer: pastInput,
					correctAnswer: currentVerb.past,
				});
			}
			if (!participleCorrect) {
				addMistake({
					type: "verb",
					questionId: currentVerb.id,
					question: `${currentVerb.base} (participle)`,
					userAnswer: participleInput,
					correctAnswer: currentVerb.participle,
				});
			}
		}
	};

	const handleNext = () => {
		if (currentIndex < verbs.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setPastInput("");
			setParticipleInput("");
			setIsSubmitted(false);
			setIsPastCorrect(null);
			setIsParticipleCorrect(null);
			setShowHint(false);
		} else {
			// Session complete
			updateStreak();
			endSession(
				score,
				QUESTIONS_PER_SESSION,
				score * XP_PER_CORRECT,
				verbs.map((v) => v.base),
			);
			setSessionStarted(false);
		}
	};

	const handleUseHint = () => {
		setShowHint(true);
		setHintsUsed(hintsUsed + 1);
	};

	if (verbs.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-pulse text-4xl mb-4">✨</div>
					<p className="text-gray-600 dark:text-gray-400">Loading verbs...</p>
				</div>
			</div>
		);
	}

	if (!sessionStarted) {
		const accuracy = (score / QUESTIONS_PER_SESSION) * 100;
		return (
			<div className="min-h-screen flex items-center justify-center p-6">
				<Card className="max-w-md w-full text-center animate-slideUp">
					<div className="text-6xl mb-4">
						{accuracy >= 80 ? "🏆" : accuracy >= 60 ? "⭐" : "💪"}
					</div>
					<h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
						Session Complete!
					</h2>
					<div className="space-y-3 mb-6">
						<div className="text-lg">
							<span className="font-semibold text-purple-600">Score:</span>{" "}
							{score}/{QUESTIONS_PER_SESSION}
						</div>
						<div className="text-lg">
							<span className="font-semibold text-green-600">Accuracy:</span>{" "}
							{accuracy.toFixed(0)}%
						</div>
						<div className="text-lg">
							<span className="font-semibold text-orange-600">XP Earned:</span>{" "}
							+{score * XP_PER_CORRECT - hintsUsed * HINT_PENALTY}
						</div>
					</div>
					<div className="space-y-3">
						<Button
							variant="primary"
							fullWidth
							onClick={() => {
								initializeQuestions();
								setCurrentIndex(0);
								setScore(0);
								setHintsUsed(0);
								setPastInput("");
								setParticipleInput("");
								setIsSubmitted(false);
								setIsPastCorrect(null);
								setIsParticipleCorrect(null);
								setShowHint(false);
							}}
						>
							Play Again
						</Button>
						<Link to="/">
							<Button variant="outline" fullWidth>
								Back to Home
							</Button>
						</Link>
					</div>
				</Card>
			</div>
		);
	}

	const currentVerb = verbs[currentIndex];

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
			<div className="max-w-2xl mx-auto space-y-6 animate-slideDown">
				{/* Header */}
				<div className="flex items-center justify-between">
					<Link to="/">
						<Button variant="outline" size="sm">
							← Back
						</Button>
					</Link>
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-800 dark:text-white">
							Irregular Verbs
						</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Question {currentIndex + 1} of {verbs.length}
						</p>
					</div>
					<div className="w-20" /> {/* Spacer */}
				</div>

				{/* Progress Bar */}
				<ProgressBar
					current={currentIndex + 1}
					max={verbs.length}
					color="purple"
					size="md"
					showPercentage
				/>

				{/* Stats */}
				<div className="flex justify-between gap-4">
					<Card className="flex-1 text-center">
						<div className="text-2xl font-bold text-purple-600">{score}</div>
						<p className="text-xs text-gray-600 dark:text-gray-400">Correct</p>
					</Card>
					<Card className="flex-1 text-center">
						<div className="text-2xl font-bold text-blue-600">
							{score * XP_PER_CORRECT}
						</div>
						<p className="text-xs text-gray-600 dark:text-gray-400">XP</p>
					</Card>
				</div>

				{/* Question Card */}
				<Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
					<div className="text-center mb-6">
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
							Fill in the verb forms for:
						</p>
						<h2 className="text-4xl font-bold text-purple-600 mb-2">
							{currentVerb.base}
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-400">
							({currentVerb.translation})
						</p>
						{currentVerb.difficulty && (
							<span
								className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
									currentVerb.difficulty === "common"
										? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
										: currentVerb.difficulty === "medium"
											? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
											: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
								}`}
							>
								{currentVerb.difficulty}
							</span>
						)}
					</div>

					{/* Input Fields */}
					<div className="space-y-4">
						<Input
							label="Past Simple"
							placeholder="e.g., went"
							value={pastInput}
							onChange={(e) => setPastInput(e.target.value)}
							disabled={isSubmitted}
							error={
								isSubmitted && !isPastCorrect
									? `Correct: ${currentVerb.past}`
									: undefined
							}
						/>

						<Input
							label="Past Participle"
							placeholder="e.g., gone"
							value={participleInput}
							onChange={(e) => setParticipleInput(e.target.value)}
							disabled={isSubmitted}
							error={
								isSubmitted && !isParticipleCorrect
									? `Correct: ${currentVerb.participle}`
									: undefined
							}
						/>
					</div>

					{/* Hint Button */}
					{!isSubmitted && !showHint && (
						<Button
							variant="outline"
							fullWidth
							size="sm"
							onClick={handleUseHint}
							className="mt-4"
						>
							💡 Use Hint (-{HINT_PENALTY} XP)
						</Button>
					)}

					{/* Hint Display */}
					{showHint && !isSubmitted && (
						<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
							<p className="font-semibold mb-1">Hint:</p>
							<p>
								Past: {currentVerb.past[0]}
								{"*".repeat(currentVerb.past.length - 1)}
							</p>
							<p>
								Participle: {currentVerb.participle[0]}
								{"*".repeat(currentVerb.participle.length - 1)}
							</p>
						</div>
					)}

					{/* Examples */}
					{currentVerb.examples && currentVerb.examples.length > 0 && (
						<div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
								Examples:
							</p>
							{currentVerb.examples.slice(0, 2).map((example, idx) => (
								<p
									key={idx}
									className="text-sm text-gray-600 dark:text-gray-400 italic"
								>
									• {example}
								</p>
							))}
						</div>
					)}

					{/* Feedback */}
					{isSubmitted && (
						<div
							className={`mt-6 p-4 rounded-lg text-center font-semibold animate-slideDown ${
								isPastCorrect && isParticipleCorrect
									? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
									: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
							}`}
						>
							{isPastCorrect && isParticipleCorrect ? (
								<div className="text-2xl">✓ Perfect!</div>
							) : (
								<div>
									<div className="text-2xl mb-1">Not quite</div>
									<div className="text-sm">
										{!isPastCorrect && `Past: ${currentVerb.past}`}
										{!isPastCorrect && !isParticipleCorrect && " | "}
										{!isParticipleCorrect &&
											`Participle: ${currentVerb.participle}`}
									</div>
								</div>
							)}
						</div>
					)}
				</Card>

				{/* Submit/Next Button */}
				{!isSubmitted ? (
					<Button
						variant="primary"
						fullWidth
						size="lg"
						onClick={handleSubmit}
						disabled={!pastInput.trim() || !participleInput.trim()}
					>
						Check Answer
					</Button>
				) : (
					<Button
						variant="primary"
						fullWidth
						size="lg"
						onClick={handleNext}
						className="animate-slideUp"
					>
						{currentIndex < verbs.length - 1 ? "Next Verb →" : "Finish"}
					</Button>
				)}
			</div>
		</div>
	);
}
