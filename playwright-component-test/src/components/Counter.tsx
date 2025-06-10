import { useState } from "react";

interface CounterProps {
	initialCount?: number;
	onCountChange?: (count: number) => void;
}

export function Counter({ initialCount = 0, onCountChange }: CounterProps) {
	const [count, setCount] = useState(initialCount);

	const handleIncrement = () => {
		const newCount = count + 1;
		setCount(newCount);
		onCountChange?.(newCount);
	};

	const handleDecrement = () => {
		const newCount = count - 1;
		setCount(newCount);
		onCountChange?.(newCount);
	};

	const handleReset = () => {
		setCount(initialCount);
		onCountChange?.(initialCount);
	};

	return (
		<div className="counter">
			<h2>Counter Component</h2>
			<div className="counter-display">
				<button type="button" onClick={handleDecrement} aria-label="Decrement">
					-
				</button>
				<span data-testid="count-value">{count}</span>
				<button type="button" onClick={handleIncrement} aria-label="Increment">
					+
				</button>
			</div>
			<button type="button" onClick={handleReset} className="reset-button">
				Reset
			</button>
		</div>
	);
}
