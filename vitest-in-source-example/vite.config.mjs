/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // enable in-source testing
        includeSource: ["src/**/*.{js,ts}", "**/*.{js,ts}"],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'text-summary', 'html'],
        },
    },
}); 