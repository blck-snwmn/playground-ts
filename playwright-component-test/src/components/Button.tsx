import type { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "danger";
	size?: "small" | "medium" | "large";
}

export function Button({
	children,
	onClick,
	disabled = false,
	variant = "primary",
	size = "medium",
}: ButtonProps) {
	return (
		<button
			type="button"
			className={`btn btn-${variant} btn-${size}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
