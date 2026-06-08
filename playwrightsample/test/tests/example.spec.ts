import { expect, test } from "@playwright/test";

test("heading text", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.getByRole("heading")).toHaveText("Hello Hono!");
});

test("list item", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const items = await page.getByRole("listitem");
  await expect(items).toHaveCount(3);
  await expect(items).toHaveText(["hello world!!", "hello hono!!", "hello jsx!!"]);
});

test("p text", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.getByRole("paragraph")).toHaveText("Here are the messages.");
});
