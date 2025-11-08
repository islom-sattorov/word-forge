import { createFileRoute } from "@tanstack/react-router";
import { CustomWordsPage } from "../pages/CustomWordsPage";

export const Route = createFileRoute("/custom-words")({
	component: CustomWordsPage,
});
