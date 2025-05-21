function add(a: number, b: number): number {
	return a + b;
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest;

	describe("add", () => {
		it("should add two numbers", () => {
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
}
