import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useCustomWordsStore } from "../stores/customWordsStore";
import type { CustomWord } from "../types";

export function CustomWordsPage() {
	const { t } = useTranslation();
	const {
		customWords,
		addCustomWord,
		updateCustomWord,
		deleteCustomWord,
		searchCustomWords,
	} = useCustomWordsStore();

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingWord, setEditingWord] = useState<CustomWord | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const [formData, setFormData] = useState({
		word: "",
		translation: "",
		example: "",
	});

	const handleAddWord = () => {
		if (formData.word.trim() && formData.translation.trim()) {
			addCustomWord(formData);
			setFormData({ word: "", translation: "", example: "" });
			setIsAddModalOpen(false);
		}
	};

	const handleEditWord = () => {
		if (editingWord && formData.word.trim() && formData.translation.trim()) {
			updateCustomWord(editingWord.id, formData);
			setFormData({ word: "", translation: "", example: "" });
			setEditingWord(null);
			setIsEditModalOpen(false);
		}
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this word?")) {
			deleteCustomWord(id);
		}
	};

	const openEditModal = (word: CustomWord) => {
		setEditingWord(word);
		setFormData({
			word: word.word,
			translation: word.translation,
			example: word.example || "",
		});
		setIsEditModalOpen(true);
	};

	const displayWords = searchQuery
		? searchCustomWords(searchQuery)
		: customWords;

	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
			<div className="max-w-4xl mx-auto space-y-6 animate-slideDown">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
							{t("customWords.title")}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							{customWords.length} words in your collection
						</p>
					</div>
					<Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
						+ {t("customWords.add")}
					</Button>
				</div>

				{/* Search */}
				<Input
					placeholder={t("customWords.search")}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				{/* Words List */}
				{displayWords.length === 0 ? (
					<Card className="text-center py-12">
						<div className="text-6xl mb-4">📝</div>
						<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
							{searchQuery ? "No words found" : t("customWords.noWords")}
						</h3>
						{!searchQuery && (
							<Button
								variant="primary"
								onClick={() => setIsAddModalOpen(true)}
								className="mt-4"
							>
								{t("customWords.add")}
							</Button>
						)}
					</Card>
				) : (
					<div className="grid gap-4">
						{displayWords.map((word) => (
							<Card key={word.id} className="hover:shadow-lg transition-shadow">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<h3 className="text-xl font-bold text-gray-800 dark:text-white">
												{word.word}
											</h3>
											<span className="text-gray-400">→</span>
											<p className="text-lg text-gray-600 dark:text-gray-400">
												{word.translation}
											</p>
										</div>
										{word.example && (
											<p className="text-sm text-gray-500 dark:text-gray-400 italic">
												"{word.example}"
											</p>
										)}
										<p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
											Added: {new Date(word.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => openEditModal(word)}
										>
											{t("customWords.edit")}
										</Button>
										<Button
											variant="danger"
											size="sm"
											onClick={() => handleDelete(word.id)}
										>
											{t("customWords.delete")}
										</Button>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Add Word Modal */}
			<Modal
				isOpen={isAddModalOpen}
				onClose={() => {
					setIsAddModalOpen(false);
					setFormData({ word: "", translation: "", example: "" });
				}}
				title={t("customWords.add")}
			>
				<div className="space-y-4">
					<Input
						label={t("customWords.word")}
						value={formData.word}
						onChange={(e) => setFormData({ ...formData, word: e.target.value })}
						placeholder="e.g., serendipity"
					/>
					<Input
						label={t("customWords.translation")}
						value={formData.translation}
						onChange={(e) =>
							setFormData({ ...formData, translation: e.target.value })
						}
						placeholder="e.g., счастливая случайность"
					/>
					<Input
						label={t("customWords.example")}
						value={formData.example}
						onChange={(e) =>
							setFormData({ ...formData, example: e.target.value })
						}
						placeholder="e.g., Finding this app was pure serendipity!"
					/>
					<div className="flex gap-3">
						<Button
							variant="primary"
							fullWidth
							onClick={handleAddWord}
							disabled={!formData.word.trim() || !formData.translation.trim()}
						>
							{t("customWords.save")}
						</Button>
						<Button
							variant="outline"
							fullWidth
							onClick={() => {
								setIsAddModalOpen(false);
								setFormData({ word: "", translation: "", example: "" });
							}}
						>
							{t("customWords.cancel")}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Edit Word Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setEditingWord(null);
					setFormData({ word: "", translation: "", example: "" });
				}}
				title={t("customWords.edit")}
			>
				<div className="space-y-4">
					<Input
						label={t("customWords.word")}
						value={formData.word}
						onChange={(e) => setFormData({ ...formData, word: e.target.value })}
					/>
					<Input
						label={t("customWords.translation")}
						value={formData.translation}
						onChange={(e) =>
							setFormData({ ...formData, translation: e.target.value })
						}
					/>
					<Input
						label={t("customWords.example")}
						value={formData.example}
						onChange={(e) =>
							setFormData({ ...formData, example: e.target.value })
						}
					/>
					<div className="flex gap-3">
						<Button
							variant="primary"
							fullWidth
							onClick={handleEditWord}
							disabled={!formData.word.trim() || !formData.translation.trim()}
						>
							{t("customWords.save")}
						</Button>
						<Button
							variant="outline"
							fullWidth
							onClick={() => {
								setIsEditModalOpen(false);
								setEditingWord(null);
								setFormData({ word: "", translation: "", example: "" });
							}}
						>
							{t("customWords.cancel")}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
