import { createFileRoute } from "@tanstack/react-router";
import { LearnVerbsPage } from "../pages/LearnVerbsPage";

export const Route = createFileRoute("/learn/verbs")({
	component: LearnVerbsPage,
});
