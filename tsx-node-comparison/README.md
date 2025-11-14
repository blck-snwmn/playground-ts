# TSX vs Node.js TypeScript Execution Comparison

Comparison between `tsx` and Node.js native TypeScript execution.

## Prerequisites

- Node.js v25.2.0 or later
- pnpm

## Installation

```bash
pnpm install
```

## Run

### `work-both.ts` - Works with both

```bash
tsx work-both.ts
node work-both.ts
```

### `work-tsx.ts` - Works with tsx only

```bash
tsx work-tsx.ts
node work-tsx.ts  # Error: TypeScript enum is not supported in strip-only mode
```
