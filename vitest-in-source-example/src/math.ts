function add(a: number, b: number): number {
	return a + b;
}

function subtract(a: number, b: number): number {
	return a - b;
}

function multiply(a: number, b: number): number {
	return a * b;
}

function divide(a: number, b: number): number {
	if (b === 0) {
		throw new Error("Cannot divide by zero");
	}
	return a / b;
}

function isEven(num: number): boolean {
	return num % 2 === 0;
}

function factorial(n: number): number {
	if (n < 0) {
		throw new Error("Factorial is not defined for negative numbers");
	}
	if (n === 0 || n === 1) {
		return 1;
	}
	return n * factorial(n - 1);
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest;

	describe("Math operations", () => {
		describe("add", () => {
			it("should add two positive numbers", () => {
				expect(add(1, 2)).toBe(3);
			});

			it("should handle negative numbers", () => {
				expect(add(-1, -2)).toBe(-3);
			});

			it("should handle zero", () => {
				expect(add(0, 0)).toBe(0);
			});

			it("should add a positive and a negative number", () => {
				expect(add(-1, 2)).toBe(1);
			});
		});

		describe("subtract", () => {
			it("should subtract two numbers", () => {
				expect(subtract(5, 3)).toBe(2);
			});

			it("should handle negative result", () => {
				expect(subtract(3, 5)).toBe(-2);
			});
		});

		describe("multiply", () => {
			it("should multiply two numbers", () => {
				expect(multiply(3, 4)).toBe(12);
			});

			it("should handle zero", () => {
				expect(multiply(5, 0)).toBe(0);
			});
		});

		describe("divide", () => {
			it("should divide two numbers", () => {
				expect(divide(10, 2)).toBe(5);
			});

			it("should throw error when dividing by zero", () => {
				expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
			});
		});

		describe("isEven", () => {
			it("should return true for even numbers", () => {
				expect(isEven(2)).toBe(true);
				expect(isEven(0)).toBe(true);
			});

			it("should return false for odd numbers", () => {
				expect(isEven(1)).toBe(false);
				expect(isEven(3)).toBe(false);
			});
		});

		describe("factorial", () => {
			it("should calculate factorial correctly", () => {
				expect(factorial(0)).toBe(1);
				expect(factorial(1)).toBe(1);
				expect(factorial(5)).toBe(120);
			});

			it("should throw error for negative numbers", () => {
				expect(() => factorial(-1)).toThrow("Factorial is not defined for negative numbers");
			});
		});
	});
}
