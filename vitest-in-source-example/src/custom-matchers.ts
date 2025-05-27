// Error handling and advanced assertion examples

export class ValidationError extends Error {
	constructor(
		message: string,
		public field: string,
		public code: string,
	) {
		super(message);
		this.name = "ValidationError";
	}
}

export class ApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public endpoint: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export function validateEmail(email: string): void {
	if (!email) {
		throw new ValidationError("Email is required", "email", "REQUIRED");
	}

	if (!email.includes("@")) {
		throw new ValidationError(
			"Email must contain @ symbol",
			"email",
			"INVALID_FORMAT",
		);
	}

	if (email.length < 5) {
		throw new ValidationError("Email is too short", "email", "TOO_SHORT");
	}
}

export function parseNumber(value: string): number {
	if (!value) {
		throw new Error("Value is required");
	}

	const parsed = Number(value);

	if (Number.isNaN(parsed)) {
		throw new Error(`Cannot parse "${value}" as number`);
	}

	return parsed;
}

export class Calculator {
	divide(a: number, b: number): number {
		if (b === 0) {
			throw new Error("Division by zero");
		}
		return a / b;
	}

	sqrt(x: number): number {
		if (x < 0) {
			throw new Error("Cannot calculate square root of negative number");
		}
		return Math.sqrt(x);
	}
}

export function fetchData(
	url: string,
): Promise<{ url: string; data: string; timestamp: number }> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (url.includes("error")) {
				reject(new ApiError("Server error", 500, url));
			} else if (url.includes("notfound")) {
				reject(new ApiError("Not found", 404, url));
			} else if (url.includes("unauthorized")) {
				reject(new ApiError("Unauthorized", 401, url));
			} else {
				resolve({ data: "success", url, timestamp: Date.now() });
			}
		}, 100);
	});
}

// Utility functions for object testing
export function createUser(
	data: Partial<{ name: string; age: number; email: string }>,
) {
	return {
		id: Math.floor(Math.random() * 1000),
		name: data.name || "Anonymous",
		age: data.age || 0,
		email: data.email || "",
		createdAt: new Date(),
		isActive: true,
		metadata: {
			source: "test",
			version: "1.0.0",
		},
	};
}

// Helper functions for custom assertions
export function isValidEmail(email: string): boolean {
	if (typeof email !== "string" || email.length < 5) {
		return false;
	}

	// Check if @ is in a valid position (not at start or end)
	const atIndex = email.indexOf("@");
	return atIndex > 0 && atIndex < email.length - 1;
}

export function isPositiveNumber(num: number): boolean {
	return typeof num === "number" && num > 0;
}

export function isWithinRange(num: number, min: number, max: number): boolean {
	return typeof num === "number" && num >= min && num <= max;
}

export function hasRequiredFields(
	obj: object,
	fields: string[],
): { valid: boolean; missing: string[] } {
	const missing = fields.filter((field) => !(field in obj));
	return { valid: missing.length === 0, missing };
}

if (import.meta.vitest) {
	const { describe, it, expect, beforeEach } = import.meta.vitest;

	describe("Advanced Error Handling and Assertions", () => {
		describe("Helper function assertions", () => {
			it("should validate emails with helper function", () => {
				expect(isValidEmail("test@example.com")).toBe(true);
				expect(isValidEmail("valid.email@domain.org")).toBe(true);

				expect(isValidEmail("invalid-email")).toBe(false);
				expect(isValidEmail("@invalid.com")).toBe(false);
				expect(isValidEmail("test")).toBe(false);
			});

			it("should validate positive numbers", () => {
				expect(isPositiveNumber(5)).toBe(true);
				expect(isPositiveNumber(0.1)).toBe(true);
				expect(isPositiveNumber(1000)).toBe(true);

				expect(isPositiveNumber(0)).toBe(false);
				expect(isPositiveNumber(-5)).toBe(false);
			});

			it("should check number ranges", () => {
				expect(isWithinRange(5, 1, 10)).toBe(true);
				expect(isWithinRange(50, 0, 100)).toBe(true);
				expect(isWithinRange(0, 0, 5)).toBe(true);

				expect(isWithinRange(15, 1, 10)).toBe(false);
				expect(isWithinRange(-5, 0, 100)).toBe(false);
			});

			it("should validate required object fields", () => {
				const user = { id: 1, name: "Miko", email: "miko@example.com" };
				const incomplete = { id: 1, name: "Miko" };

				expect(hasRequiredFields(user, ["id", "name", "email"])).toEqual({
					valid: true,
					missing: [],
				});

				expect(hasRequiredFields(incomplete, ["id", "name", "email"])).toEqual({
					valid: false,
					missing: ["email"],
				});
			});
		});

		describe("Error handling patterns", () => {
			describe("ValidationError testing", () => {
				it("should throw ValidationError for empty email", () => {
					expect(() => validateEmail("")).toThrow(ValidationError);
					expect(() => validateEmail("")).toThrow("Email is required");

					try {
						validateEmail("");
					} catch (error) {
						expect(error).toBeInstanceOf(ValidationError);
						if (error instanceof ValidationError) {
							expect(error.field).toBe("email");
							expect(error.code).toBe("REQUIRED");
						}
					}
				});

				it("should throw ValidationError for invalid email format", () => {
					expect(() => validateEmail("invalid")).toThrow(ValidationError);
					expect(() => validateEmail("invalid")).toThrow(
						"Email must contain @ symbol",
					);

					const error = (() => {
						try {
							validateEmail("invalid");
						} catch (e) {
							return e;
						}
					})();

					expect(error).toBeInstanceOf(ValidationError);
					if (error instanceof ValidationError) {
						expect(error.code).toBe("INVALID_FORMAT");
					}
				});
			});

			describe("Number parsing errors", () => {
				it("should handle parsing errors", () => {
					expect(() => parseNumber("")).toThrow("Value is required");
					expect(() => parseNumber("abc")).toThrow(
						'Cannot parse "abc" as number',
					);
					expect(() => parseNumber("not-a-number")).toThrow(
						/Cannot parse .* as number/,
					);

					// Should not throw for valid numbers
					expect(() => parseNumber("123")).not.toThrow();
					expect(parseNumber("456")).toBe(456);
				});
			});

			describe("Calculator error scenarios", () => {
				let calculator: Calculator;

				beforeEach(() => {
					calculator = new Calculator();
				});

				it("should handle division by zero", () => {
					expect(() => calculator.divide(10, 0)).toThrow("Division by zero");
					expect(() => calculator.divide(5, 0)).toThrowError(/zero/);
				});

				it("should handle negative square root", () => {
					expect(() => calculator.sqrt(-1)).toThrow(
						"Cannot calculate square root of negative number",
					);
					expect(() => calculator.sqrt(-5)).toThrowError(/negative/);

					// Should work for positive numbers
					expect(calculator.sqrt(4)).toBe(2);
					expect(calculator.sqrt(9)).toBe(3);
				});
			});

			describe("Async error handling", () => {
				it("should handle API errors", async () => {
					await expect(fetchData("/error")).rejects.toThrow(ApiError);
					await expect(fetchData("/error")).rejects.toThrow("Server error");

					try {
						await fetchData("/error");
					} catch (error) {
						expect(error).toBeInstanceOf(ApiError);
						if (error instanceof ApiError) {
							expect(error.statusCode).toBe(500);
							expect(error.endpoint).toBe("/error");
						}
					}
				});

				it("should handle different HTTP status codes", async () => {
					// 404 Not Found
					await expect(fetchData("/notfound")).rejects.toMatchObject({
						name: "ApiError",
						statusCode: 404,
						endpoint: "/notfound",
					});

					// 401 Unauthorized
					await expect(fetchData("/unauthorized")).rejects.toMatchObject({
						name: "ApiError",
						statusCode: 401,
						message: "Unauthorized",
					});

					// Success case
					await expect(fetchData("/success")).resolves.toMatchObject({
						data: "success",
						url: "/success",
					});
				});
			});
		});

		describe("Advanced object matching", () => {
			it("should match object properties", () => {
				const user = createUser({
					name: "Miko",
					age: 25,
					email: "miko@example.com",
				});

				expect(user).toMatchObject({
					name: "Miko",
					age: 25,
					email: "miko@example.com",
					isActive: true,
				});

				expect(user).toHaveProperty("id");
				expect(user).toHaveProperty("createdAt");
				expect(user).toHaveProperty("metadata.source", "test");
				expect(user).toHaveProperty("metadata.version", "1.0.0");
			});

			it("should use asymmetric matchers", () => {
				const user = createUser({ name: "Miko" });

				expect(user).toEqual({
					id: expect.any(Number),
					name: "Miko",
					age: 0,
					email: "",
					createdAt: expect.any(Date),
					isActive: true,
					metadata: {
						source: expect.stringMatching(/test/),
						version: expect.stringContaining("1.0"),
					},
				});

				expect(user.id).toEqual(expect.any(Number));
				expect(user.createdAt).toEqual(expect.any(Date));
			});

			it("should check array contents", () => {
				const data = [
					{ id: 1, name: "Item 1" },
					{ id: 2, name: "Item 2" },
					{ id: 3, name: "Item 3" },
				];

				expect(data).toHaveLength(3);
				expect(data).toContainEqual(expect.objectContaining({ id: 2 }));
				expect(data).toEqual(
					expect.arrayContaining([expect.objectContaining({ name: "Item 1" })]),
				);

				expect(data).not.toContainEqual(expect.objectContaining({ id: 999 }));
			});
		});
	});
}
