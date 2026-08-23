# Valibot and Zod comparison

The same schema is implemented with Valibot and Zod to compare their APIs and behavior without a framework.

```sh
bun install
bun run dev
bun run typecheck
```

## What this sample compares

| Concern | Valibot | Zod |
| --- | --- | --- |
| Composition | `v.pipe(...)` | Method chaining and `.pipe(...)` |
| Parse | `v.parse(schema, input)` | `schema.parse(input)` |
| Safe parse | `v.safeParse(schema, input)` | `schema.safeParse(input)` |
| Tagged union | `v.variant(...)` | `z.discriminatedUnion(...)` |
| Default | `v.optional(schema, default)` | `schema.default(default)` |
| Output type | `v.InferOutput<typeof schema>` | `z.output<typeof schema>` |
| Error summary | `v.flatten(issues)` | `z.flattenError(error)` |

`index.ts` is intentionally organized into three sections: the complete Zod example, the complete Valibot example, and the final output comparison.
