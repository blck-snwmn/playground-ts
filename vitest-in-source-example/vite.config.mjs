/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // enable in-source testing
        includeSource: ["src/**/*.{js,ts}", "**/*.{js,ts}"],
        // coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                'test/**',
                '**/*.config.*',
                '**/*.test.*',
                '**/*.spec.*',
                '**/types/**',
                'coverage/**'
            ],
            // include source files for coverage
            include: ['src/**/*.{js,ts,jsx,tsx}'],
            // coverage thresholds
            thresholds: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80
                }
            }
        }
    },
}); 