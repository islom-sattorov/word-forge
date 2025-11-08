import { useState } from "react";
import { Button } from "../components/ui/Button";
// import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useGamificationStore } from "../stores/gamificationStore";
import { useSessionsStore } from "../stores/sessionsStore";
import { useUserStore } from "../stores/userStore";

export function ProfilePage() {
	// const { t } = useTranslation();
	const user = useUserStore((state) => state.user);
	const updateUser = useUserStore((state) => state.updateUser);
	const { xp, streak, level, achievements } = useGamificationStore();
	const sessions = useSessionsStore((state) => state.sessions);

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [newUsername, setNewUsername] = useState(user?.username || "");

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

	// const xpToNextLevel = level * 100;
	const currentLevelXP = xp % 100;

	const handleSaveProfile = () => {
		if (newUsername.trim()) {
			updateUser({ username: newUsername.trim() });
			setIsEditModalOpen(false);
		}
	};

	const unlockedAchievements = achievements.filter((a) => a.isUnlocked);

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
			<div className="max-w-4xl mx-auto space-y-6 animate-slideDown">
				{/* Profile Header */}
				<Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl overflow-hidden">
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt={user.username}
										className="w-full h-full object-cover"
										onError={(e) => {
											// Fallback to emoji if image fails to load
											e.currentTarget.style.display = "none";
											e.currentTarget.parentElement!.textContent = "👤";
										}}
									/>
								) : (
									"👤"
								)}
							</div>
							<div>
								<h1 className="text-3xl font-bold">{user?.username}</h1>
								<p className="text-indigo-100">
									Level {level} • {xp} XP
								</p>
								{user?.username !== "Guest" && (
									<p className="text-indigo-200 text-sm flex items-center gap-1">
										<span className="text-blue-300">✈️</span> Telegram User
									</p>
								)}
							</div>
						</div>
						<Button
							variant="outline"
							onClick={() => {
								setNewUsername(user?.username || "");
								setIsEditModalOpen(true);
							}}
							className="bg-white/10 border-white/30 text-white hover:bg-white/20"
						>
							Edit Profile
						</Button>
					</div>

					{/* Level Progress */}
					<div className="mt-6">
						<ProgressBar
							current={currentLevelXP}
							max={100}
							label={`Level ${level} Progress`}
							showPercentage
							color="purple"
						/>
					</div>
				</Card>

				{/* Streak Card */}
				<Card className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
								Current Streak
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Keep it going! 🎯
							</p>
						</div>
						<div className="text-right">
							<div className="text-5xl font-bold text-orange-600">
								🔥 {streak}
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400">days</p>
						</div>
					</div>
				</Card>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 gap-4">
					<Card>
						<div className="text-center">
							<div className="text-3xl font-bold text-green-600">
								{wordsLearned}
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Words Learned
							</p>
						</div>
					</Card>
					<Card>
						<div className="text-center">
							<div className="text-3xl font-bold text-purple-600">
								{verbsLearned}
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Verbs Mastered
							</p>
						</div>
					</Card>
					<Card>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600">
								{totalSessions}
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Total Sessions
							</p>
						</div>
					</Card>
					<Card>
						<div className="text-center">
							<div className="text-3xl font-bold text-orange-600">
								{averageAccuracy.toFixed(0)}%
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Avg Accuracy
							</p>
						</div>
					</Card>
				</div>

				{/* Achievements */}
				<Card>
					<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
						Achievements ({unlockedAchievements.length}/{achievements.length})
					</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
						{achievements.map((achievement) => (
							<div
								key={achievement.id}
								className={`p-4 rounded-lg border-2 transition-all ${
									achievement.isUnlocked
										? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700"
										: "bg-gray-50 border-gray-200 opacity-50 dark:bg-gray-800 dark:border-gray-700"
								}`}
							>
								<div className="text-3xl mb-2 text-center">
									{achievement.icon}
								</div>
								<h4 className="font-bold text-sm text-gray-800 dark:text-white text-center">
									{achievement.title}
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
									{achievement.description}
								</p>
								{achievement.isUnlocked && achievement.unlockedAt && (
									<p className="text-xs text-green-600 dark:text-green-400 text-center mt-2">
										✓ Unlocked
									</p>
								)}
							</div>
						))}
					</div>
				</Card>
			</div>

			{/* Edit Profile Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Edit Profile"
			>
				<div className="space-y-4">
					<Input
						label="Username"
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)}
						placeholder="Enter your username"
					/>
					<div className="flex gap-3">
						<Button
							variant="primary"
							fullWidth
							onClick={handleSaveProfile}
							disabled={!newUsername.trim()}
						>
							Save
						</Button>
						<Button
							variant="outline"
							fullWidth
							onClick={() => setIsEditModalOpen(false)}
						>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
