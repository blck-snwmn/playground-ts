# Playwright Component Testing Sample

This project demonstrates Playwright Component Testing with React components.

## Setup

Install dependencies:
```bash
pnpm install
```

## Running Tests

Run component tests:
```bash
pnpm test-ct
```

Run tests with UI mode:
```bash
pnpm test-ct:ui
```

## Project Structure

```
playwright-component-test/
├── src/
│   └── components/
│       ├── Button.tsx      # Simple button component
│       └── Counter.tsx     # Counter component with state
├── tests/
│   ├── Button.spec.tsx     # Button component tests
│   └── Counter.spec.tsx    # Counter component tests
├── playwright/
│   ├── index.html         # HTML template for component mounting
│   └── index.tsx          # Entry point for test environment
├── playwright-ct.config.ts # Playwright component testing configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Components

### Counter Component
A simple counter with increment, decrement, and reset functionality.
- Props: `initialCount`, `onCountChange`
- Features: State management, callback support

### Button Component  
A reusable button component with variants and sizes.
- Props: `children`, `onClick`, `disabled`, `variant`, `size`
- Variants: primary, secondary, danger
- Sizes: small, medium, large

## Test Features Demonstrated

- Component mounting and rendering
- User interaction simulation (clicks)
- Props testing
- State verification
- Callback testing
- Accessibility testing (ARIA labels)
- CSS class verification
- Disabled state handling