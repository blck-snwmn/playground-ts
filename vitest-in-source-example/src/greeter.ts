function greet(name: string): string {
    return `Hello, ${name}!`;
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest;

    describe('greet', () => {
        it('should greet a person by name', () => {
            expect(greet('Miko')).toBe('Hello, Miko!');
        });

        it('should handle an empty name', () => {
            expect(greet('')).toBe('Hello, !');
        });
    });
} 