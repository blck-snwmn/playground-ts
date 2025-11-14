interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! Your email is ${user.email}`;
}

function calculateTotal(products: Product[]): number {
  return products.reduce((sum, product) => sum + product.price, 0);
}

// Sample data
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mouse", price: 500 },
  { id: 3, name: "Keyboard", price: 3000 },
];

// Execute
console.log("=== TypeScript Execution Demo ===");
console.log(greetUser(user));
console.log(`Total price: ¥${calculateTotal(products)}`);

// Type checking demo
type Status = "active" | "inactive" | "pending";

function printStatus(status: Status): void {
  console.log(`Current status: ${status}`);
}

printStatus("active");

console.log("✅ TypeScript execution successful!");
