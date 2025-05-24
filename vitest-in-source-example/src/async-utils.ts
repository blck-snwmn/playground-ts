// Async utilities for demonstrating various async testing patterns

export async function fetchUserData(id: number): Promise<{ id: number; name: string; email: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    if (id <= 0) {
        throw new Error("Invalid user ID");
    }

    return {
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`
    };
}

export function delayedGreeting(name: string, delay: number = 1000): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Hello, ${name}! (after ${delay}ms)`);
        }, delay);
    });
}

export async function processDataBatch(items: string[]): Promise<string[]> {
    const results: string[] = [];

    for (const item of items) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 50));
        results.push(item.toUpperCase());
    }

    return results;
}

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = "https://api.example.com") {
        this.baseUrl = baseUrl;
    }

    async get(endpoint: string): Promise<any> {
        // Simulate fetch call
        await new Promise(resolve => setTimeout(resolve, 200));

        if (endpoint === "/error") {
            throw new Error("API Error");
        }

        return { data: `Response from ${endpoint}` };
    }

    async post(endpoint: string, data: any): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true, data, endpoint };
    }
}

if (import.meta.vitest) {
    const { describe, it, expect, vi, beforeEach, afterEach } = import.meta.vitest;

    describe("Async utilities", () => {
        beforeEach(() => {
            // Setup before each test
            vi.useFakeTimers();
        });

        afterEach(() => {
            // Cleanup after each test
            vi.restoreAllMocks();
            vi.useRealTimers();
        });

        describe("fetchUserData", () => {
            it("should fetch user data successfully", async () => {
                vi.useRealTimers(); // Use real timers for this test
                const user = await fetchUserData(1);

                expect(user).toEqual({
                    id: 1,
                    name: "User 1",
                    email: "user1@example.com"
                });
            });

            it("should throw error for invalid ID", async () => {
                vi.useRealTimers(); // Use real timers for this test
                await expect(fetchUserData(0)).rejects.toThrow("Invalid user ID");
                await expect(fetchUserData(-1)).rejects.toThrow("Invalid user ID");
            });

            it("should handle multiple concurrent requests", async () => {
                vi.useRealTimers(); // Use real timers for this test
                const promises = [
                    fetchUserData(1),
                    fetchUserData(2),
                    fetchUserData(3)
                ];

                const results = await Promise.all(promises);

                expect(results).toHaveLength(3);
                expect(results[0].id).toBe(1);
                expect(results[1].id).toBe(2);
                expect(results[2].id).toBe(3);
            });
        });

        describe("delayedGreeting", () => {
            it("should resolve after specified delay", async () => {
                const promise = delayedGreeting("Miko", 1000);

                // Fast-forward time
                vi.advanceTimersByTime(1000);

                const result = await promise;
                expect(result).toBe("Hello, Miko! (after 1000ms)");
            });

            it("should use default delay", async () => {
                const promise = delayedGreeting("Test");

                vi.advanceTimersByTime(1000);

                const result = await promise;
                expect(result).toBe("Hello, Test! (after 1000ms)");
            });
        });

        describe("processDataBatch", () => {
            it("should process all items in batch", async () => {
                vi.useRealTimers(); // Use real timers for this test
                const items = ["hello", "world", "vitest"];
                const result = await processDataBatch(items);

                expect(result).toEqual(["HELLO", "WORLD", "VITEST"]);
            });

            it("should handle empty array", async () => {
                const result = await processDataBatch([]);
                expect(result).toEqual([]);
            });
        });

        describe("ApiClient", () => {
            let client: ApiClient;

            beforeEach(() => {
                client = new ApiClient();
            });

            it("should make GET requests successfully", async () => {
                vi.useRealTimers(); // Use real timers for this test
                const result = await client.get("/users");

                expect(result).toEqual({
                    data: "Response from /users"
                });
            });

            it("should make POST requests successfully", async () => {
                vi.useRealTimers(); // Use real timers for this test
                const postData = { name: "Miko", age: 25 };
                const result = await client.post("/users", postData);

                expect(result).toEqual({
                    success: true,
                    data: postData,
                    endpoint: "/users"
                });
            });

            it("should handle API errors", async () => {
                vi.useRealTimers(); // Use real timers for this test
                await expect(client.get("/error")).rejects.toThrow("API Error");
            });

            it("should use custom base URL", () => {
                const customClient = new ApiClient("https://custom.api.com");
                expect(customClient).toBeInstanceOf(ApiClient);
            });
        });
    });
} 