import { createFileRoute } from "@tanstack/react-router";
import { LearnWordsPage } from "../pages/LearnWordsPage";

export const Route = createFileRoute("/learn/words")({
	component: LearnWordsPage,
});
