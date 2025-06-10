import { expect, test } from "@playwright/experimental-ct-react";
import { Counter } from "../src/components/Counter";

test.describe("Counter Component", () => {
	test("should render with default count of 0", async ({ mount }) => {
		const component = await mount(<Counter />);

		const countValue = component.getByTestId("count-value");
		await expect(countValue).toContainText("0");
	});

	test("should render with initial count", async ({ mount }) => {
		const component = await mount(<Counter initialCount={10} />);

		const countValue = component.getByTestId("count-value");
		await expect(countValue).toContainText("10");
	});

	test("should increment count when + button is clicked", async ({ mount }) => {
		const component = await mount(<Counter />);

		const incrementButton = component.getByRole("button", {
			name: "Increment",
		});
		const countValue = component.getByTestId("count-value");

		await incrementButton.click();
		await expect(countValue).toContainText("1");

		await incrementButton.click();
		await expect(countValue).toContainText("2");
	});

	test("should decrement count when - button is clicked", async ({ mount }) => {
		const component = await mount(<Counter initialCount={5} />);

		const decrementButton = component.getByRole("button", {
			name: "Decrement",
		});
		const countValue = component.getByTestId("count-value");

		await decrementButton.click();
		await expect(countValue).toContainText("4");

		await decrementButton.click();
		await expect(countValue).toContainText("3");
	});

	test("should reset to initial count when Reset button is clicked", async ({
		mount,
	}) => {
		const component = await mount(<Counter initialCount={5} />);

		const incrementButton = component.getByRole("button", {
			name: "Increment",
		});
		const resetButton = component.getByText("Reset");
		const countValue = component.getByTestId("count-value");

		// Increment a few times
		await incrementButton.click();
		await incrementButton.click();
		await expect(countValue).toContainText("7");

		// Reset
		await resetButton.click();
		await expect(countValue).toContainText("5");
	});

	test("should call onCountChange callback when count changes", async ({
		mount,
	}) => {
		let capturedCount: number | undefined;
		const handleCountChange = (count: number) => {
			capturedCount = count;
		};

		const component = await mount(
			<Counter initialCount={0} onCountChange={handleCountChange} />,
		);

		const incrementButton = component.getByRole("button", {
			name: "Increment",
		});

		await incrementButton.click();
		expect(capturedCount).toBe(1);
	});

	test("should handle negative numbers", async ({ mount }) => {
		const component = await mount(<Counter initialCount={0} />);

		const decrementButton = component.getByRole("button", {
			name: "Decrement",
		});
		const countValue = component.getByTestId("count-value");

		await decrementButton.click();
		await expect(countValue).toContainText("-1");

		await decrementButton.click();
		await expect(countValue).toContainText("-2");
	});
});
