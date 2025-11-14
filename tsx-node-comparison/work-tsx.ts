// This file works with tsx but NOT with Node.js native TypeScript execution

// 1. const enum (not supported by Node.js)
const enum Color {
  Red = "#ff0000",
  Green = "#00ff00",
  Blue = "#0000ff",
}

// 2. namespace (not supported)
namespace AppUtils {
  export function greet(name: string): string {
    return `Hello, ${name}!`;
  }

  export const version = "1.0.0";
}

// 3. Using const enum
function getColorHex(color: Color): string {
  return color;
}

// Execute
console.log("=== TSX-Only Features Demo ===");

// Using const enum
const redColor = getColorHex(Color.Red);
const greenColor = getColorHex(Color.Green);
const blueColor = getColorHex(Color.Blue);
console.log(`Red color code: ${redColor}`);
console.log(`Green color code: ${greenColor}`);
console.log(`Blue color code: ${blueColor}`);

// Using namespace
console.log(AppUtils.greet("World"));
console.log(`Version: ${AppUtils.version}`);

console.log("✅ All TSX-only features executed successfully!");
