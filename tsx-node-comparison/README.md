# TSX vs Node.js TypeScript Execution Comparison

Comparison between `tsx` and Node.js native TypeScript execution.

## Prerequisites

- Node.js v25.2.0 or later
- Bun

## Installation

```bash
bun install
```

## Run

### `work-both.ts` - Works with both

```bash
bunx tsx work-both.ts
node work-both.ts
```

### `work-tsx.ts` - Works with tsx only

```bash
bunx tsx work-tsx.ts
node work-tsx.ts  # Error: TypeScript enum is not supported in strip-only mode
```
