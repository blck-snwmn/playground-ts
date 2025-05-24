# Vitest In-Source Testing with Coverage Example

This project demonstrates how to set up Vitest with in-source testing and comprehensive coverage reporting, featuring various testing patterns and techniques.

## Features

- ✅ In-source testing with Vitest
- ✅ Code coverage with V8 provider
- ✅ HTML, JSON, and text coverage reports
- ✅ Coverage thresholds (80% for all metrics)
- ✅ TypeScript support
- ✅ Comprehensive test examples covering various scenarios

## Installation

```bash
pnpm install
```

## Scripts

- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once and exit
- `pnpm test:coverage` - Run tests with coverage (once and exit)
- `pnpm test:coverage:ui` - Run tests with coverage and open UI
- `pnpm test:coverage:watch` - Run tests with coverage in watch mode

## Coverage Configuration

The coverage is configured in `vite.config.mjs` with:

- **Provider**: V8 (faster and more accurate than Istanbul)
- **Reporters**: Text (console), JSON (machine-readable), HTML (visual)
- **Thresholds**: 80% for branches, functions, lines, and statements
- **Include**: `src/**/*.{js,ts,jsx,tsx}` files
- **Exclude**: Test files, config files, node_modules, etc.

## Coverage Reports

After running `pnpm test:coverage`, you'll find:

- **Console output**: Immediate feedback in terminal
- **HTML report**: Open `coverage/index.html` in your browser for detailed visual report
- **JSON report**: Machine-readable data in `coverage/coverage-final.json`

## File Structure and Test Examples

```
src/
├── greeter.ts              # Basic greeting functions with simple tests
├── math.ts                 # Math operations with comprehensive tests
├── async-utils.ts          # Async/Promise testing, timers, and API simulation
├── mock-examples.ts        # Mocking, spying, and dependency injection
├── parameterized-tests.ts  # Parameterized tests, snapshots, and test matrices
└── custom-matchers.ts      # Error handling and advanced assertions
```

### Test Examples Covered

1. **Basic In-Source Testing** (`greeter.ts`, `math.ts`)
   - Simple unit tests
   - Function testing with various inputs
   - Error boundary testing

2. **Async Testing** (`async-utils.ts`)
   - Promise-based functions
   - async/await patterns
   - Timer mocking with `vi.useFakeTimers()`
   - Concurrent request testing
   - API client simulation

3. **Mocking and Spying** (`mock-examples.ts`)
   - Interface mocking
   - Dependency injection testing
   - Function spies
   - Mock return values and implementations
   - Event emitter testing

4. **Parameterized Testing** (`parameterized-tests.ts`)
   - `test.each()` for data-driven tests
   - `describe.each()` for test suites
   - Snapshot testing with `toMatchSnapshot()`
   - Inline snapshots
   - Test matrices for comprehensive coverage

5. **Advanced Error Handling** (`custom-matchers.ts`)
   - Custom error classes
   - Error assertion patterns
   - Object property validation
   - Asymmetric matchers
   - Complex object matching

## In-Source Testing

Tests are written directly in the source files using the `import.meta.vitest` pattern:

```typescript
function add(a: number, b: number): number {
    return a + b;
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest;
    
    describe('add', () => {
        it('should add two numbers', () => {
            expect(add(1, 2)).toBe(3);
        });
    });
}
```

## Advanced Testing Patterns

### Async Testing
```typescript
// Timer mocking
vi.useFakeTimers();
const promise = delayedFunction();
vi.advanceTimersByTime(1000);
await promise;

// Promise testing
await expect(asyncFunction()).resolves.toBe(expected);
await expect(failingFunction()).rejects.toThrow(ErrorType);
```

### Mocking
```typescript
// Interface mocking
const mockService = {
    method: vi.fn().mockResolvedValue(result)
};

// Spy on existing methods
const spy = vi.spyOn(object, 'method');
expect(spy).toHaveBeenCalledWith(args);
```

### Parameterized Tests
```typescript
// Test multiple cases
test.each([
    { input: 'a', expected: 'A' },
    { input: 'b', expected: 'B' }
])('should convert $input to $expected', ({ input, expected }) => {
    expect(convert(input)).toBe(expected);
});
```

### Snapshot Testing
```typescript
// Full object snapshots
expect(complexObject).toMatchSnapshot();

// Inline snapshots (auto-generated)
expect(data).toMatchInlineSnapshot(`...`);
```

## Coverage Thresholds

The project is configured with 80% coverage thresholds. If coverage falls below these thresholds, the tests will fail:

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

You can adjust these thresholds in `vite.config.mjs`.

## Running Different Test Types

```bash
# Run all tests
pnpm test:run

# Run with coverage
pnpm test:coverage

# Watch mode for development
pnpm test

# Coverage with UI
pnpm test:coverage:ui
```

## Example Output

```
 % Coverage report from v8
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |                   
 greeter.ts |     100 |      100 |     100 |     100 |                   
 math.ts    |     100 |      100 |     100 |     100 |                   
 async-utils.ts    |     100 |      100 |     100 |     100 |                   
 mock-examples.ts  |     100 |      100 |     100 |     100 |                   
 parameterized-tests.ts |     100 |      100 |     100 |     100 |                   
 custom-matchers.ts     |     100 |      100 |     100 |     100 |                   
------------|---------|----------|---------|---------|-------------------
```

This project serves as a comprehensive reference for various Vitest testing patterns and best practices! 