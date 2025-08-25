import { Result, err, fromPromise, fromThrowable, ok } from "neverthrow";

interface User {
	id: number;
	name: string;
	email: string;
}

type UserNotFoundError = {
	type: "USER_NOT_FOUND";
	userId: number;
	message: string;
};

type InvalidEmailError = {
	type: "INVALID_EMAIL";
	email: string;
	message: string;
};

const validateEmail = (email: string): Result<string, InvalidEmailError> => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (emailRegex.test(email)) {
		return ok(email);
	}
	return err({
		type: "INVALID_EMAIL",
		email,
		message: `Invalid email format: ${email}`,
	});
};

const fetchUserFromDB = async (userId: number): Promise<User | null> => {
	const users: User[] = [
		{ id: 1, name: "Alice", email: "alice@example.com" },
		{ id: 2, name: "Bob", email: "bob@example.com" },
	];

	await new Promise((resolve) => setTimeout(resolve, 100));

	return users.find((user) => user.id === userId) || null;
};

const getUser = async (
	userId: number,
): Promise<Result<User, UserNotFoundError>> => {
	const user = await fetchUserFromDB(userId);

	if (user) {
		return ok(user);
	}

	return err({
		type: "USER_NOT_FOUND",
		userId,
		message: `User with id ${userId} not found`,
	});
};

const updateUserEmail = async (
	userId: number,
	newEmail: string,
): Promise<Result<User, UserNotFoundError | InvalidEmailError>> => {
	const emailValidation = validateEmail(newEmail);

	if (emailValidation.isErr()) {
		return err(emailValidation.error);
	}

	const userResult = await getUser(userId);

	return userResult.map((user) => ({
		...user,
		email: newEmail,
	}));
};

const divide = (a: number, b: number): Result<number, string> => {
	if (b === 0) {
		return err("Division by zero");
	}
	return ok(a / b);
};

const parseJSON = fromThrowable(
	JSON.parse,
	(error) => `Failed to parse JSON: ${error}`,
);

const fetchData = async (url: string) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

const safeFetch = (url: string) =>
	fromPromise(fetchData(url), (error) => `Network error: ${error}`);

const processUserData = async () => {
	console.log("=== neverthrow Sample ===\n");

	console.log("1. Basic Result handling:");
	const divisionResult = divide(10, 2);
	if (divisionResult.isOk()) {
		console.log(`10 / 2 = ${divisionResult.value}`);
	}

	const divisionByZero = divide(10, 0);
	if (divisionByZero.isErr()) {
		console.log(`Error: ${divisionByZero.error}`);
	}

	console.log("\n2. User operations:");
	const user1 = await getUser(1);
	user1.match(
		(user) => console.log(`Found user: ${user.name} (${user.email})`),
		(error) => console.log(error.message),
	);

	const user3 = await getUser(3);
	user3.match(
		(user) => console.log(`Found user: ${user.name}`),
		(error) => console.log(error.message),
	);

	console.log("\n3. Email update with validation:");
	const updateResult = await updateUserEmail(1, "alice.new@example.com");
	updateResult.match(
		(user) =>
			console.log(`Updated user: ${user.name} with email: ${user.email}`),
		(error) => console.log(`Update failed: ${error.message}`),
	);

	const invalidUpdate = await updateUserEmail(1, "invalid-email");
	invalidUpdate.match(
		(user) => console.log(`Updated user: ${user.name}`),
		(error) => console.log(`Update failed: ${error.message}`),
	);

	console.log("\n4. JSON parsing:");
	console.log("--- 通常のJSON.parseの場合 ---");
	try {
		const data = JSON.parse('{"name": "Test", "value": 42}');
		console.log("成功:", data);
	} catch (error) {
		console.log("例外:", error);
	}

	try {
		const data = JSON.parse("invalid json");
		console.log("成功:", data);
	} catch (error) {
		console.log("例外が投げられた:", error);
	}

	console.log("\n--- fromThrowableを使った場合 ---");
	const validJson = parseJSON('{"name": "Test", "value": 42}');
	validJson.match(
		(data) => console.log("成功Result:", data),
		(error) => console.log("エラーResult:", error),
	);

	const invalidJson = parseJSON("invalid json");
	invalidJson.match(
		(data) => console.log("成功Result:", data),
		(error) => console.log("エラーResult:", error),
	);

	console.log("\n5. Chaining operations:");
	const userResult = await getUser(1);
	const result = userResult
		.andThen((user) => validateEmail(user.email))
		.map((email) => `Valid email: ${email}`);

	result.match(
		(message) => console.log(message),
		(error) => console.log(`Chain failed: ${error.message}`),
	);

	console.log("\n6. Combining multiple Results:");
	const results = Result.combine([divide(20, 4), divide(15, 3), divide(10, 2)]);

	results.match(
		(values) => console.log("All divisions succeeded:", values),
		(error) => console.log("At least one division failed:", error),
	);

	console.log("\n7. Error type discrimination:");
	const nonExistentUser = await updateUserEmail(999, "test@example.com");

	nonExistentUser.match(
		(user) => console.log(`Updated: ${user.name}`),
		(error) => {
			if (error.type === "USER_NOT_FOUND") {
				console.log(`User error: User ID ${error.userId} not found`);
			} else if (error.type === "INVALID_EMAIL") {
				console.log(`Email error: "${error.email}" is invalid`);
			}
		},
	);
};

processUserData().catch(console.error);
