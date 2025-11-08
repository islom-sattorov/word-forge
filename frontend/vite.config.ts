import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		tailwindcss(),
	],
	server: {
		port: 5173,
		allowedHosts: ["penultimately-apocatastatic-eloise.ngrok-free.dev"],
	},
});
