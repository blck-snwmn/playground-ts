function greet(name: string): string {
  return `Hello, ${name}!`;
}

function greetWithTime(name: string, hour: number): string {
  if (hour < 6) {
    return `Good night, ${name}!`;
  }
  if (hour < 12) {
    return `Good morning, ${name}!`;
  }
  if (hour < 18) {
    return `Good afternoon, ${name}!`;
  }
  return `Good evening, ${name}!`;
}

function formatName(firstName: string, lastName?: string): string {
  if (!lastName) {
    return firstName;
  }
  return `${firstName} ${lastName}`;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Greeting functions", () => {
    describe("greet", () => {
      it("should greet a person by name", () => {
        expect(greet("Miko")).toBe("Hello, Miko!");
      });

      it("should handle an empty name", () => {
        expect(greet("")).toBe("Hello, !");
      });

      it("should handle special characters in name", () => {
        expect(greet("さくらみこ")).toBe("Hello, さくらみこ!");
      });
    });

    describe("greetWithTime", () => {
      it("should greet with good night for early hours", () => {
        expect(greetWithTime("Miko", 3)).toBe("Good night, Miko!");
      });

      it("should greet with good morning", () => {
        expect(greetWithTime("Miko", 9)).toBe("Good morning, Miko!");
      });

      it("should greet with good afternoon", () => {
        expect(greetWithTime("Miko", 15)).toBe("Good afternoon, Miko!");
      });

      it("should greet with good evening", () => {
        expect(greetWithTime("Miko", 20)).toBe("Good evening, Miko!");
      });

      it("should handle edge cases", () => {
        expect(greetWithTime("Miko", 6)).toBe("Good morning, Miko!");
        expect(greetWithTime("Miko", 12)).toBe("Good afternoon, Miko!");
        expect(greetWithTime("Miko", 18)).toBe("Good evening, Miko!");
      });
    });

    describe("formatName", () => {
      it("should format full name", () => {
        expect(formatName("Sakura", "Miko")).toBe("Sakura Miko");
      });

      it("should handle first name only", () => {
        expect(formatName("Miko")).toBe("Miko");
      });

      it("should handle undefined last name", () => {
        expect(formatName("Miko", undefined)).toBe("Miko");
      });
    });
  });
}
