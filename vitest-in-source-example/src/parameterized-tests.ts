// Parameterized tests and snapshot testing examples

export function validatePassword(password: string): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push("Password must be at least 8 characters long");
	}

	if (!/[A-Z]/.test(password)) {
		errors.push("Password must contain at least one uppercase letter");
	}

	if (!/[a-z]/.test(password)) {
		errors.push("Password must contain at least one lowercase letter");
	}

	if (!/\d/.test(password)) {
		errors.push("Password must contain at least one number");
	}

	if (!/[!@#$%^&*]/.test(password)) {
		errors.push(
			"Password must contain at least one special character (!@#$%^&*)",
		);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

export function calculateTax(income: number, region: string): number {
	const taxRates: Record<string, number> = {
		US: 0.25,
		UK: 0.2,
		JP: 0.23,
		DE: 0.42,
		FR: 0.45,
	};

	const rate = taxRates[region] || 0.25; // Default to US rate
	return Math.round(income * rate * 100) / 100; // Round to 2 decimal places
}

export function formatCurrency(
	amount: number,
	currency: string,
	locale: string,
): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
	}).format(amount);
}

interface ProcessableItem {
	id: string | number;
	[key: string]: unknown;
}

interface ProcessedItem extends ProcessableItem {
	processed: boolean;
	timestamp: string;
}

export function processItems(items: unknown[]): {
	processed: ProcessedItem[];
	stats: { total: number; valid: number; invalid: number };
} {
	const processed: ProcessedItem[] = [];
	let valid = 0;
	let invalid = 0;

	for (const item of items) {
		if (item && typeof item === "object" && "id" in item) {
			processed.push({
				...(item as ProcessableItem),
				processed: true,
				timestamp: new Date().toISOString(),
			});
			valid++;
		} else {
			invalid++;
		}
	}

	return {
		processed,
		stats: {
			total: items.length,
			valid,
			invalid,
		},
	};
}

export function generateUserProfile(user: {
	name: string;
	age: number;
	email: string;
	preferences: string[];
}): {
	id: string;
	name: string;
	age: number;
	email: string;
	preferences: string[];
	createdAt: string;
	settings: {
		notifications: boolean;
		theme: string;
		language: string;
	};
	stats: {
		loginCount: number;
		lastLogin: null;
	};
} {
	return {
		id: Math.random().toString(36).substr(2, 9),
		...user,
		createdAt: new Date().toISOString(),
		settings: {
			notifications: true,
			theme: "light",
			language: "en",
		},
		stats: {
			loginCount: 0,
			lastLogin: null,
		},
	};
}

if (import.meta.vitest) {
	const { describe, it, expect, test } = import.meta.vitest;

	describe("Parameterized Tests and Snapshots", () => {
		describe("Password validation with parameterized tests", () => {
			// Test cases for valid passwords
			const validPasswords = [
				"StrongPass123!",
				"MySecure2024@",
				"Complex#456Password",
				"Valid123$Test",
			];

			// Test cases for invalid passwords
			const invalidPasswordCases = [
				{
					password: "short",
					expectedErrors: [
						"Password must be at least 8 characters long",
						"Password must contain at least one uppercase letter",
						"Password must contain at least one number",
						"Password must contain at least one special character (!@#$%^&*)",
					],
				},
				{
					password: "nouppercase123!",
					expectedErrors: [
						"Password must contain at least one uppercase letter",
					],
				},
				{
					password: "NOLOWERCASE123!",
					expectedErrors: [
						"Password must contain at least one lowercase letter",
					],
				},
				{
					password: "NoNumbers!",
					expectedErrors: ["Password must contain at least one number"],
				},
				{
					password: "NoSpecialChars123",
					expectedErrors: [
						"Password must contain at least one special character (!@#$%^&*)",
					],
				},
			];

			// Parameterized test for valid passwords
			test.each(validPasswords)(
				"should validate password '%s' as valid",
				(password) => {
					const result = validatePassword(password);
					expect(result.valid).toBe(true);
					expect(result.errors).toHaveLength(0);
				},
			);

			// Parameterized test for invalid passwords
			test.each(invalidPasswordCases)(
				"should validate password '$password' with correct errors",
				({ password, expectedErrors }) => {
					const result = validatePassword(password);
					expect(result.valid).toBe(false);
					expect(result.errors).toEqual(expectedErrors);
				},
			);
		});

		describe("Tax calculation with describe.each", () => {
			const taxTestCases = [
				{ income: 50000, region: "US", expected: 12500 },
				{ income: 50000, region: "UK", expected: 10000 },
				{ income: 50000, region: "JP", expected: 11500 },
				{ income: 50000, region: "DE", expected: 21000 },
				{ income: 50000, region: "FR", expected: 22500 },
				{ income: 100000, region: "US", expected: 25000 },
				{ income: 75000, region: "UNKNOWN", expected: 18750 }, // Should use default US rate
			];

			describe.each(taxTestCases)(
				"Tax calculation for income $income in region $region",
				({ income, region, expected }) => {
					it(`should calculate tax as ${expected}`, () => {
						const result = calculateTax(income, region);
						expect(result).toBe(expected);
					});
				},
			);
		});

		describe("Currency formatting with parameterized tests", () => {
			it("should format USD currency correctly", () => {
				const result = formatCurrency(1234.56, "USD", "en-US");
				expect(result).toBe("$1,234.56");
			});

			it("should format EUR currency correctly", () => {
				const result = formatCurrency(1234.56, "EUR", "de-DE");
				// Check that the result contains the expected components
				expect(result).toMatch(/1\.234,56/);
				expect(result).toContain("€");
			});

			it("should format JPY currency correctly", () => {
				const result = formatCurrency(1234.56, "JPY", "ja-JP");
				expect(result).toBe("￥1,235");
			});

			it("should format GBP currency correctly", () => {
				const result = formatCurrency(1234.56, "GBP", "en-GB");
				expect(result).toBe("£1,234.56");
			});
		});

		describe("Snapshot testing examples", () => {
			it("should match DataProcessor output snapshot", () => {
				const testData = [
					{ id: 1, name: "Item 1", type: "product" },
					{ id: 2, name: "Item 2", type: "service" },
					{ name: "Invalid item" }, // Missing id
					null, // Invalid item
					{ id: 3, name: "Item 3", type: "digital" },
				];

				const result = processItems(testData);

				// Remove timestamp for consistent snapshots
				result.processed = result.processed.map((item) => {
					const { timestamp, ...rest } = item;
					return rest as ProcessedItem;
				});

				expect(result).toMatchSnapshot();
			});

			it("should match user profile snapshot", () => {
				const userData = {
					name: "Sakura Miko",
					age: 25,
					email: "miko@hololive.com",
					preferences: ["gaming", "streaming", "singing"],
				};

				const profile = generateUserProfile(userData);

				// Remove dynamic fields for consistent snapshots
				const { id, createdAt, ...staticProfile } = profile;

				expect(staticProfile).toMatchSnapshot();
			});

			it("should demonstrate inline snapshots", () => {
				const data = {
					name: "Test User",
					settings: {
						theme: "dark",
						language: "en",
					},
				};

				expect(data).toMatchInlineSnapshot(`
					{
					  "name": "Test User",
					  "settings": {
					    "language": "en",
					    "theme": "dark",
					  },
					}
				`);
			});
		});

		describe("Advanced test patterns", () => {
			const mathOperations = [
				{ operation: "add", a: 5, b: 3, expected: 8 },
				{ operation: "subtract", a: 5, b: 3, expected: 2 },
				{ operation: "multiply", a: 5, b: 3, expected: 15 },
				{ operation: "divide", a: 6, b: 3, expected: 2 },
			];

			describe.each(mathOperations)(
				"Math operation: $operation",
				({ operation, a, b, expected }) => {
					it(`should calculate ${a} ${operation} ${b} = ${expected}`, () => {
						let result: number;

						switch (operation) {
							case "add":
								result = a + b;
								break;
							case "subtract":
								result = a - b;
								break;
							case "multiply":
								result = a * b;
								break;
							case "divide":
								result = a / b;
								break;
							default:
								throw new Error(`Unknown operation: ${operation}`);
						}

						expect(result).toBe(expected);
					});
				},
			);

			// Test matrix for different combinations
			const testMatrix = [
				{ input: "", expected: "empty" },
				{ input: " ", expected: "whitespace" },
				{ input: "hello", expected: "text" },
				{ input: "123", expected: "number" },
				{ input: "hello123", expected: "mixed" },
			];

			test.each(testMatrix)(
				"should classify input '$input' as '$expected'",
				({ input, expected }) => {
					function classifyInput(str: string): string {
						if (str === "") return "empty";
						if (str.trim() === "") return "whitespace";
						if (/^\d+$/.test(str)) return "number";
						if (/\d/.test(str) && /[a-zA-Z]/.test(str)) return "mixed";
						return "text";
					}

					expect(classifyInput(input)).toBe(expected);
				},
			);
		});
	});
}
