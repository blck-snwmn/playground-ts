import { expect, test } from "@playwright/experimental-ct-react";
import { type Todo, TodoList } from "../src/components/TodoList";

test.describe("TodoList Component", () => {
  test("should render empty todo list", async ({ mount }) => {
    const component = await mount(<TodoList />);

    await expect(component.getByRole("heading", { name: "Todo List" })).toBeVisible();
    await expect(component.getByTestId("stats-total")).toContainText("Total: 0");
    await expect(component.getByTestId("stats-active")).toContainText("Active: 0");
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 0");
  });

  test("should add a new todo", async ({ mount }) => {
    const component = await mount(<TodoList />);

    const input = component.getByTestId("todo-input");
    const addButton = component.getByTestId("add-button");

    await input.fill("New todo item");
    await addButton.click();

    await expect(component.getByText("New todo item")).toBeVisible();
    await expect(component.getByTestId("stats-total")).toContainText("Total: 1");
    await expect(component.getByTestId("stats-active")).toContainText("Active: 1");
  });

  test("should add todo on Enter key", async ({ mount }) => {
    const component = await mount(<TodoList />);

    const input = component.getByTestId("todo-input");
    await input.fill("Todo via Enter");
    await input.press("Enter");

    await expect(component.getByText("Todo via Enter")).toBeVisible();
  });

  test("should not add empty todo", async ({ mount }) => {
    const component = await mount(<TodoList />);

    const input = component.getByTestId("todo-input");
    const addButton = component.getByTestId("add-button");

    await input.fill("   ");
    await addButton.click();

    await expect(component.getByTestId("stats-total")).toContainText("Total: 0");
  });

  test("should toggle todo completion", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          {
            id: "1",
            text: "Test todo",
            completed: false,
            createdAt: new Date(),
          },
        ]}
      />,
    );

    const checkbox = component.getByTestId("checkbox-1");
    await expect(checkbox).not.toBeChecked();

    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 1");
    await expect(component.getByTestId("stats-active")).toContainText("Active: 0");
  });

  test("should delete todo", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          {
            id: "1",
            text: "Todo to delete",
            completed: false,
            createdAt: new Date(),
          },
        ]}
      />,
    );

    await expect(component.getByTestId("stats-total")).toContainText("Total: 1");

    const deleteButton = component.getByTestId("delete-btn-1");
    await deleteButton.click();

    await expect(component.getByTestId("stats-total")).toContainText("Total: 0");
    await expect(component.getByText("Todo to delete")).not.toBeVisible();
  });

  test("should edit todo on double click", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          {
            id: "1",
            text: "Original text",
            completed: false,
            createdAt: new Date(),
          },
        ]}
      />,
    );

    const todoText = component.getByTestId("todo-text-1");
    await todoText.dblclick();

    const editInput = component.getByTestId("edit-input-1");
    await expect(editInput).toBeVisible();
    await expect(editInput).toHaveValue("Original text");

    await editInput.clear();
    await editInput.fill("Updated text");
    await component.getByTestId("save-btn-1").click();

    await expect(component.getByTestId("todo-text-1")).toContainText("Updated text");
  });

  test("should cancel edit on Escape key", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          {
            id: "1",
            text: "Original text",
            completed: false,
            createdAt: new Date(),
          },
        ]}
      />,
    );

    const todoText = component.getByTestId("todo-text-1");
    await todoText.dblclick();

    const editInput = component.getByTestId("edit-input-1");
    await editInput.clear();
    await editInput.fill("New text");
    await editInput.press("Escape");

    await expect(component.getByTestId("todo-text-1")).toContainText("Original text");
  });

  test("should save edit on Enter key", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          {
            id: "1",
            text: "Original text",
            completed: false,
            createdAt: new Date(),
          },
        ]}
      />,
    );

    const todoText = component.getByTestId("todo-text-1");
    await todoText.dblclick();

    const editInput = component.getByTestId("edit-input-1");
    await editInput.clear();
    await editInput.fill("Saved with Enter");
    await editInput.press("Enter");

    await expect(component.getByTestId("todo-text-1")).toContainText("Saved with Enter");
  });

  test("should filter todos", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          {
            id: "1",
            text: "Active todo",
            completed: false,
            createdAt: new Date(),
          },
          {
            id: "2",
            text: "Completed todo",
            completed: true,
            createdAt: new Date(),
          },
          {
            id: "3",
            text: "Another active",
            completed: false,
            createdAt: new Date(),
          },
        ]}
      />,
    );

    const todoList = component.getByTestId("todo-list");

    // All filter (default)
    await expect(todoList.locator("li")).toHaveCount(3);

    // Active filter
    await component.getByTestId("filter-active").click();
    await expect(todoList.locator("li")).toHaveCount(2);
    await expect(component.getByText("Active todo")).toBeVisible();
    await expect(component.getByText("Another active")).toBeVisible();
    await expect(component.getByText("Completed todo")).not.toBeVisible();

    // Completed filter
    await component.getByTestId("filter-completed").click();
    await expect(todoList.locator("li")).toHaveCount(1);
    await expect(component.getByText("Completed todo")).toBeVisible();

    // Back to all
    await component.getByTestId("filter-all").click();
    await expect(todoList.locator("li")).toHaveCount(3);
  });

  test("should sort todos", async ({ mount }) => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const component = await mount(
      <TodoList
        initialTodos={[
          { id: "1", text: "B todo", completed: false, createdAt: yesterday },
          { id: "2", text: "A todo", completed: false, createdAt: now },
          { id: "3", text: "C todo", completed: false, createdAt: twoDaysAgo },
        ]}
      />,
    );

    const sortSelect = component.getByTestId("sort-select");
    const todoTexts = component.locator('[data-testid^="todo-text-"]');

    // Newest first (default)
    await expect(todoTexts.nth(0)).toContainText("A todo");
    await expect(todoTexts.nth(1)).toContainText("B todo");
    await expect(todoTexts.nth(2)).toContainText("C todo");

    // Oldest first
    await sortSelect.selectOption("oldest");
    await expect(todoTexts.nth(0)).toContainText("C todo");
    await expect(todoTexts.nth(1)).toContainText("B todo");
    await expect(todoTexts.nth(2)).toContainText("A todo");

    // Alphabetical
    await sortSelect.selectOption("alphabetical");
    await expect(todoTexts.nth(0)).toContainText("A todo");
    await expect(todoTexts.nth(1)).toContainText("B todo");
    await expect(todoTexts.nth(2)).toContainText("C todo");
  });

  test("should toggle all todos", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          { id: "1", text: "Todo 1", completed: false, createdAt: new Date() },
          { id: "2", text: "Todo 2", completed: false, createdAt: new Date() },
          { id: "3", text: "Todo 3", completed: true, createdAt: new Date() },
        ]}
      />,
    );

    const toggleAllButton = component.getByTestId("toggle-all");

    // Initial state: 2 active, 1 completed
    await expect(component.getByTestId("stats-active")).toContainText("Active: 2");
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 1");
    await expect(toggleAllButton).toContainText("Check All");

    // Toggle all to completed
    await toggleAllButton.click();
    await expect(component.getByTestId("stats-active")).toContainText("Active: 0");
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 3");
    await expect(toggleAllButton).toContainText("Uncheck All");

    // Toggle all to active
    await toggleAllButton.click();
    await expect(component.getByTestId("stats-active")).toContainText("Active: 3");
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 0");
  });

  test("should clear completed todos", async ({ mount }) => {
    const component = await mount(
      <TodoList
        initialTodos={[
          {
            id: "1",
            text: "Active todo",
            completed: false,
            createdAt: new Date(),
          },
          {
            id: "2",
            text: "Completed 1",
            completed: true,
            createdAt: new Date(),
          },
          {
            id: "3",
            text: "Completed 2",
            completed: true,
            createdAt: new Date(),
          },
        ]}
      />,
    );

    await expect(component.getByTestId("stats-total")).toContainText("Total: 3");
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 2");

    const clearButton = component.getByTestId("clear-completed");
    await expect(clearButton).toContainText("Clear Completed (2)");

    await clearButton.click();

    await expect(component.getByTestId("stats-total")).toContainText("Total: 1");
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 0");
    await expect(component.getByText("Active todo")).toBeVisible();
    await expect(component.getByText("Completed 1")).not.toBeVisible();
    await expect(component.getByText("Completed 2")).not.toBeVisible();
  });

  test("should handle onTodoChange callback", async ({ mount }) => {
    let capturedTodos: Todo[] = [];
    const handleChange = (todos: Todo[]) => {
      capturedTodos = todos;
    };

    const component = await mount(<TodoList onTodoChange={handleChange} />);

    const input = component.getByTestId("todo-input");
    await input.fill("New todo");
    await input.press("Enter");

    expect(capturedTodos).toHaveLength(1);
    expect(capturedTodos[0].text).toBe("New todo");
  });

  test("should persist todos to localStorage", async ({ mount, page }) => {
    const storageKey = "test-todos";

    // Clear localStorage first
    await page.evaluate((key) => localStorage.removeItem(key), storageKey);

    const component = await mount(<TodoList enableLocalStorage={true} storageKey={storageKey} />);

    // Add a todo
    const input = component.getByTestId("todo-input");
    await input.fill("Persisted todo");
    await input.press("Enter");

    // Check localStorage
    const stored = await page.evaluate((key) => localStorage.getItem(key), storageKey);
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored as string);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].text).toBe("Persisted todo");
  });

  test("should load todos from localStorage", async ({ mount, page }) => {
    const storageKey = "test-todos-load";
    const testTodos = [
      {
        id: "1",
        text: "Stored todo",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    // Set localStorage
    await page.evaluate(
      ({ key, todos }) => {
        localStorage.setItem(key, JSON.stringify(todos));
      },
      { key: storageKey, todos: testTodos },
    );

    const component = await mount(<TodoList enableLocalStorage={true} storageKey={storageKey} />);

    await expect(component.getByText("Stored todo")).toBeVisible();
    await expect(component.getByTestId("stats-total")).toContainText("Total: 1");
  });

  test("should handle multiple todos efficiently", async ({ mount }) => {
    const manyTodos = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      text: `Todo ${i}`,
      completed: i % 2 === 0,
      createdAt: new Date(Date.now() - i * 60000), // Each todo 1 minute apart
    }));

    const component = await mount(<TodoList initialTodos={manyTodos} />);

    await expect(component.getByTestId("stats-total")).toContainText("Total: 10");
    await expect(component.getByTestId("stats-active")).toContainText("Active: 5");
    await expect(component.getByTestId("stats-completed")).toContainText("Completed: 5");

    // Test filter performance
    await component.getByTestId("filter-active").click();
    await expect(component.getByTestId("todo-list").locator("li")).toHaveCount(5);

    await component.getByTestId("filter-completed").click();
    await expect(component.getByTestId("todo-list").locator("li")).toHaveCount(5);
  });

  test("should show/hide footer controls appropriately", async ({ mount }) => {
    const component = await mount(<TodoList />);

    // No footer when no todos
    await expect(component.locator(".todo-footer")).not.toBeVisible();

    // Add a todo
    const input = component.getByTestId("todo-input");
    await input.fill("First todo");
    await input.press("Enter");

    // Footer visible, but no clear button (no completed todos)
    await expect(component.locator(".todo-footer")).toBeVisible();
    await expect(component.getByTestId("toggle-all")).toBeVisible();
    await expect(component.getByTestId("clear-completed")).not.toBeVisible();

    // Complete the todo
    const checkbox = component.locator('[data-testid^="checkbox-"]').first();
    await checkbox.click();

    // Clear button now visible
    await expect(component.getByTestId("clear-completed")).toBeVisible();
  });
});
