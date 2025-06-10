import { useEffect, useMemo, useState } from "react";

export interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: Date;
}

export type FilterType = "all" | "active" | "completed";
export type SortType = "newest" | "oldest" | "alphabetical";

interface TodoListProps {
	initialTodos?: Todo[];
	onTodoChange?: (todos: Todo[]) => void;
	enableLocalStorage?: boolean;
	storageKey?: string;
}

export function TodoList({
	initialTodos = [],
	onTodoChange,
	enableLocalStorage = false,
	storageKey = "todos",
}: TodoListProps) {
	const [todos, setTodos] = useState<Todo[]>(() => {
		if (enableLocalStorage && typeof window !== "undefined") {
			const stored = localStorage.getItem(storageKey);
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					return parsed.map((todo: any) => ({
						...todo,
						createdAt: new Date(todo.createdAt),
					}));
				} catch (e) {
					console.error("Failed to parse stored todos:", e);
				}
			}
		}
		return initialTodos;
	});

	const [inputValue, setInputValue] = useState("");
	const [filter, setFilter] = useState<FilterType>("all");
	const [sortBy, setSortBy] = useState<SortType>("newest");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingText, setEditingText] = useState("");

	useEffect(() => {
		if (enableLocalStorage && typeof window !== "undefined") {
			localStorage.setItem(storageKey, JSON.stringify(todos));
		}
		onTodoChange?.(todos);
	}, [todos, enableLocalStorage, storageKey, onTodoChange]);

	const filteredAndSortedTodos = useMemo(() => {
		let filtered = todos;

		if (filter === "active") {
			filtered = todos.filter((todo) => !todo.completed);
		} else if (filter === "completed") {
			filtered = todos.filter((todo) => todo.completed);
		}

		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return b.createdAt.getTime() - a.createdAt.getTime();
				case "oldest":
					return a.createdAt.getTime() - b.createdAt.getTime();
				case "alphabetical":
					return a.text.localeCompare(b.text);
				default:
					return 0;
			}
		});

		return sorted;
	}, [todos, filter, sortBy]);

	const stats = useMemo(() => {
		const total = todos.length;
		const completed = todos.filter((todo) => todo.completed).length;
		const active = total - completed;
		return { total, completed, active };
	}, [todos]);

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			const newTodo: Todo = {
				id: Date.now().toString(),
				text: inputValue.trim(),
				completed: false,
				createdAt: new Date(),
			};
			setTodos([...todos, newTodo]);
			setInputValue("");
		}
	};

	const toggleTodo = (id: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			),
		);
	};

	const deleteTodo = (id: string) => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const startEditing = (todo: Todo) => {
		setEditingId(todo.id);
		setEditingText(todo.text);
	};

	const saveEdit = () => {
		if (editingId && editingText.trim()) {
			setTodos(
				todos.map((todo) =>
					todo.id === editingId ? { ...todo, text: editingText.trim() } : todo,
				),
			);
		}
		setEditingId(null);
		setEditingText("");
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditingText("");
	};

	const clearCompleted = () => {
		setTodos(todos.filter((todo) => !todo.completed));
	};

	const toggleAll = () => {
		const allCompleted = todos.every((todo) => todo.completed);
		setTodos(todos.map((todo) => ({ ...todo, completed: !allCompleted })));
	};

	return (
		<div className="todo-list">
			<header className="todo-header">
				<h2>Todo List</h2>
				<div className="todo-stats">
					<span data-testid="stats-total">Total: {stats.total}</span>
					<span data-testid="stats-active">Active: {stats.active}</span>
					<span data-testid="stats-completed">
						Completed: {stats.completed}
					</span>
				</div>
			</header>

			<form onSubmit={addTodo} className="todo-form">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="What needs to be done?"
					className="todo-input"
					data-testid="todo-input"
				/>
				<button type="submit" className="todo-add-btn" data-testid="add-button">
					Add
				</button>
			</form>

			<div className="todo-controls">
				<div className="todo-filters">
					<button
						onClick={() => setFilter("all")}
						className={filter === "all" ? "active" : ""}
						data-testid="filter-all"
					>
						All
					</button>
					<button
						onClick={() => setFilter("active")}
						className={filter === "active" ? "active" : ""}
						data-testid="filter-active"
					>
						Active
					</button>
					<button
						onClick={() => setFilter("completed")}
						className={filter === "completed" ? "active" : ""}
						data-testid="filter-completed"
					>
						Completed
					</button>
				</div>

				<div className="todo-sort">
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as SortType)}
						data-testid="sort-select"
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="alphabetical">Alphabetical</option>
					</select>
				</div>
			</div>

			<ul className="todo-items" data-testid="todo-list">
				{filteredAndSortedTodos.map((todo) => (
					<li
						key={todo.id}
						className={`todo-item ${todo.completed ? "completed" : ""}`}
					>
						{editingId === todo.id ? (
							<div className="todo-edit">
								<input
									type="text"
									value={editingText}
									onChange={(e) => setEditingText(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") saveEdit();
										if (e.key === "Escape") cancelEdit();
									}}
									className="todo-edit-input"
									data-testid={`edit-input-${todo.id}`}
									autoFocus
								/>
								<button onClick={saveEdit} data-testid={`save-btn-${todo.id}`}>
									Save
								</button>
								<button
									onClick={cancelEdit}
									data-testid={`cancel-btn-${todo.id}`}
								>
									Cancel
								</button>
							</div>
						) : (
							<>
								<input
									type="checkbox"
									checked={todo.completed}
									onChange={() => toggleTodo(todo.id)}
									className="todo-checkbox"
									data-testid={`checkbox-${todo.id}`}
								/>
								<span
									className="todo-text"
									onDoubleClick={() => startEditing(todo)}
									data-testid={`todo-text-${todo.id}`}
								>
									{todo.text}
								</span>
								<button
									onClick={() => deleteTodo(todo.id)}
									className="todo-delete"
									data-testid={`delete-btn-${todo.id}`}
								>
									Delete
								</button>
							</>
						)}
					</li>
				))}
			</ul>

			{todos.length > 0 && (
				<footer className="todo-footer">
					<button
						onClick={toggleAll}
						className="toggle-all-btn"
						data-testid="toggle-all"
					>
						{todos.every((todo) => todo.completed)
							? "Uncheck All"
							: "Check All"}
					</button>
					{stats.completed > 0 && (
						<button
							onClick={clearCompleted}
							className="clear-completed-btn"
							data-testid="clear-completed"
						>
							Clear Completed ({stats.completed})
						</button>
					)}
				</footer>
			)}
		</div>
	);
}
