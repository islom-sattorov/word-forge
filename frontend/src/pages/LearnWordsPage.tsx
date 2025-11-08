// import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import {
	getRandomWords,
	getRandomWrongAnswers,
	SAMPLE_WORDS,
} from "../constants/sampleData";
import { useGamificationStore } from "../stores/gamificationStore";
import { useMistakesStore } from "../stores/mistakesStore";
import { useSessionsStore } from "../stores/sessionsStore";
import type { WordQuestion } from "../types";

const QUESTIONS_PER_SESSION = 10;
const XP_PER_CORRECT = 10;
const COMBO_BONUS_XP = 5;

export function LearnWordsPage() {
	// const { t } = useTranslation();
	const [questions, setQuestions] = useState<WordQuestion[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [score, setScore] = useState(0);
	const [combo, setCombo] = useState(0);
	const [sessionStarted, setSessionStarted] = useState(false);

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
		const randomWords = getRandomWords(QUESTIONS_PER_SESSION);
		const newQuestions: WordQuestion[] = randomWords.map((word) => {
			const wrongAnswers = getRandomWrongAnswers(
				word.translation,
				SAMPLE_WORDS,
				3,
			);
			const allOptions = [...wrongAnswers, word.translation].sort(
				() => Math.random() - 0.5,
			);

			return {
				id: word.id,
				word,
				options: allOptions,
				correctAnswer: word.translation,
			};
		});

		setQuestions(newQuestions);
		setSessionStarted(true);
		startSession("words");
	};

	const handleAnswer = (answer: string) => {
		if (selectedAnswer !== null) return; // Already answered

		setSelectedAnswer(answer);
		const correct = answer === currentQuestion.correctAnswer;
		setIsCorrect(correct);

		if (correct) {
			setScore(score + 1);
			setCombo(combo + 1);
			const earnedXP = XP_PER_CORRECT + (combo >= 3 ? COMBO_BONUS_XP : 0);
			addXP(earnedXP);
			updateDailyProgress(1);
		} else {
			setCombo(0);
			addMistake({
				type: "word",
				questionId: currentQuestion.word.id,
				question: currentQuestion.word.word,
				userAnswer: answer,
				correctAnswer: currentQuestion.correctAnswer,
			});
		}
	};

	const handleNext = () => {
		if (currentIndex < questions.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setSelectedAnswer(null);
			setIsCorrect(null);
		} else {
			// Session complete
			updateStreak();
			endSession(
				score,
				QUESTIONS_PER_SESSION,
				score * XP_PER_CORRECT,
				questions.map((q) => q.word.word),
			);
			setSessionStarted(false);
		}
	};

	if (questions.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-pulse text-4xl mb-4">📚</div>
					<p className="text-gray-600 dark:text-gray-400">
						Loading questions...
					</p>
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
						{accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👏" : "💪"}
					</div>
					<h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
						Session Complete!
					</h2>
					<div className="space-y-3 mb-6">
						<div className="text-lg">
							<span className="font-semibold text-blue-600">Score:</span>{" "}
							{score}/{QUESTIONS_PER_SESSION}
						</div>
						<div className="text-lg">
							<span className="font-semibold text-green-600">Accuracy:</span>{" "}
							{accuracy.toFixed(0)}%
						</div>
						<div className="text-lg">
							<span className="font-semibold text-orange-600">XP Earned:</span>{" "}
							+{score * XP_PER_CORRECT}
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
								setCombo(0);
								setSelectedAnswer(null);
								setIsCorrect(null);
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

	const currentQuestion = questions[currentIndex];
	// const progress = ((currentIndex + 1) / questions.length) * 100;

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
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
							Learn Words
						</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Question {currentIndex + 1} of {questions.length}
						</p>
					</div>
					<div className="text-right">
						<div className="text-lg font-bold text-orange-600">
							{combo > 0 && `🔥 ${combo}x`}
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<ProgressBar
					current={currentIndex + 1}
					max={questions.length}
					color="green"
					size="md"
					showPercentage
				/>

				{/* Stats */}
				<div className="flex justify-between gap-4">
					<Card className="flex-1 text-center">
						<div className="text-2xl font-bold text-green-600">{score}</div>
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
					<div className="text-center mb-8">
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
							Translate this word:
						</p>
						<h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
							{currentQuestion.word.word}
						</h2>
						{currentQuestion.word.example && (
							<p className="text-sm text-gray-500 dark:text-gray-400 italic">
								"{currentQuestion.word.example}"
							</p>
						)}
					</div>

					{/* Options */}
					<div className="space-y-3">
						{currentQuestion.options.map((option, index) => {
							const isSelected = selectedAnswer === option;
							const isCorrectOption = option === currentQuestion.correctAnswer;
							const showResult = selectedAnswer !== null;

							let buttonVariant: "primary" | "success" | "danger" | "outline" =
								"outline";
							if (showResult) {
								if (isCorrectOption) buttonVariant = "success";
								else if (isSelected && !isCorrect) buttonVariant = "danger";
								else buttonVariant = "outline";
							}

							return (
								<Button
									key={index}
									variant={buttonVariant}
									fullWidth
									size="lg"
									onClick={() => handleAnswer(option)}
									disabled={selectedAnswer !== null}
									className="text-left justify-start"
								>
									<span className="font-medium mr-3">
										{String.fromCharCode(65 + index)}.
									</span>
									{option}
								</Button>
							);
						})}
					</div>

					{/* Feedback */}
					{isCorrect !== null && (
						<div
							className={`mt-6 p-4 rounded-lg text-center font-semibold animate-slideDown ${
								isCorrect
									? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
									: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
							}`}
						>
							{isCorrect ? (
								<div>
									<div className="text-2xl mb-1">✓ Correct!</div>
									{combo >= 3 && (
										<div className="text-sm">
											Combo bonus! +{COMBO_BONUS_XP} XP
										</div>
									)}
								</div>
							) : (
								<div>
									<div className="text-2xl mb-1">✗ Incorrect</div>
									<div className="text-sm">
										Correct answer: {currentQuestion.correctAnswer}
									</div>
								</div>
							)}
						</div>
					)}
				</Card>

				{/* Next Button */}
				{selectedAnswer !== null && (
					<Button
						variant="primary"
						fullWidth
						size="lg"
						onClick={handleNext}
						className="animate-slideUp"
					>
						{currentIndex < questions.length - 1 ? "Next Question →" : "Finish"}
					</Button>
				)}
			</div>
		</div>
	);
}
