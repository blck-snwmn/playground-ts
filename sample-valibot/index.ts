import * as z from "zod";
import * as v from "valibot";

const validInput = {
	id: "42",
	name: "  Alice  ",
	email: "alice@example.com",
	contact: { kind: "phone", number: "+819012345678" },
} as const;

const invalidInput: unknown = {
	id: "0",
	name: "   ",
	email: "not-an-email",
	contact: { kind: "phone", number: "090-1234-5678" },
};

// Zod

const zodUserSchema = z.object({
	id: z
		.string()
		.transform(Number)
		.pipe(z.number().int("ID must be a positive integer").positive("ID must be a positive integer")),
	name: z.string().trim().min(1, "Name is required").max(30),
	email: z.email("Invalid email address"),
	role: z.enum(["admin", "member"]).default("member"),
	contact: z.discriminatedUnion("kind", [
		z.object({
			kind: z.literal("email"),
			address: z.email("Invalid contact email"),
		}),
		z.object({
			kind: z.literal("phone"),
			number: z.string().regex(/^\+\d{10,15}$/, "Invalid phone number"),
		}),
	]),
});

type ZodUserInput = z.input<typeof zodUserSchema>;
type ZodUser = z.output<typeof zodUserSchema>;

const parseWithZod = (input: unknown): ZodUser => zodUserSchema.parse(input);

const zodInput: ZodUserInput = validInput;
const zodOutput = parseWithZod(zodInput);
const zodFailure = zodUserSchema.safeParse(invalidInput);

console.log("=== Zod ===");
console.log("parsed:", zodOutput);
if (!zodFailure.success) {
	console.log("errors:", z.flattenError(zodFailure.error));
}

// Valibot

const valibotUserSchema = v.object({
	id: v.pipe(
		v.string(),
		v.transform(Number),
		v.integer("ID must be a positive integer"),
		v.minValue(1, "ID must be a positive integer"),
	),
	name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name is required"), v.maxLength(30)),
	email: v.pipe(v.string(), v.email("Invalid email address")),
	role: v.optional(v.picklist(["admin", "member"]), "member"),
	contact: v.variant("kind", [
		v.object({
			kind: v.literal("email"),
			address: v.pipe(v.string(), v.email("Invalid contact email")),
		}),
		v.object({
			kind: v.literal("phone"),
			number: v.pipe(v.string(), v.regex(/^\+\d{10,15}$/, "Invalid phone number")),
		}),
	]),
});

type ValibotUserInput = v.InferInput<typeof valibotUserSchema>;
type ValibotUser = v.InferOutput<typeof valibotUserSchema>;

const parseWithValibot = (input: unknown): ValibotUser => v.parse(valibotUserSchema, input);

const valibotInput: ValibotUserInput = validInput;
const valibotOutput = parseWithValibot(valibotInput);
const valibotFailure = v.safeParse(valibotUserSchema, invalidInput);

console.log("\n=== Valibot ===");
console.log("parsed:", valibotOutput);
if (!valibotFailure.success) {
	console.log("errors:", v.flatten(valibotFailure.issues));
}

// Comparison

console.log("\n=== Same parsed output ===");
console.log(Bun.deepEquals(zodOutput, valibotOutput));
