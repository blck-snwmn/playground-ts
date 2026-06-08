// Mock and spy examples for vitest

export interface DatabaseService {
  findUser(id: string): Promise<{ id: string; name: string } | null>;
  saveUser(user: { id: string; name: string }): Promise<void>;
  deleteUser(id: string): Promise<boolean>;
}

export interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  validateEmail(email: string): boolean;
}

export class UserService {
  constructor(
    private db: DatabaseService,
    private email: EmailService,
  ) {}

  async createUser(
    id: string,
    name: string,
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    // Validate email
    if (!this.email.validateEmail(email)) {
      return { success: false, message: "Invalid email address" };
    }

    // Check if user already exists
    const existingUser = await this.db.findUser(id);
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Save user
    await this.db.saveUser({ id, name });

    // Send welcome email
    const emailSent = await this.email.sendEmail(
      email,
      "Welcome!",
      `Hello ${name}, welcome to our service!`,
    );

    return {
      success: true,
      message: emailSent ? "User created and welcome email sent" : "User created but email failed",
    };
  }

  async removeUser(id: string): Promise<boolean> {
    const user = await this.db.findUser(id);
    if (!user) {
      return false;
    }

    return await this.db.deleteUser(id);
  }
}

// Utility functions for demonstrating different mocking scenarios
export function processWithCallback(items: string[], callback: (item: string) => string): string[] {
  return items.map(callback);
}

export function logMessage(message: string, logger = console.log): void {
  logger(`[${new Date().toISOString()}] ${message}`);
}

export class EventEmitter {
  private listeners: Map<string, Array<(...args: unknown[]) => void>> = new Map();

  on(event: string, listener: (...args: unknown[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }

  emit(event: string, ...args: unknown[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        listener(...args);
      }
    }
  }
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  describe("Mock and Spy Examples", () => {
    describe("UserService with mocked dependencies", () => {
      let userService: UserService;
      let mockDb: DatabaseService;
      let mockEmail: EmailService;

      beforeEach(() => {
        // Create mock objects
        mockDb = {
          findUser: vi.fn(),
          saveUser: vi.fn(),
          deleteUser: vi.fn(),
        };

        mockEmail = {
          sendEmail: vi.fn(),
          validateEmail: vi.fn(),
        };

        userService = new UserService(mockDb, mockEmail);
      });

      it("should create user successfully", async () => {
        // Setup mocks
        vi.mocked(mockEmail.validateEmail).mockReturnValue(true);
        vi.mocked(mockDb.findUser).mockResolvedValue(null);
        vi.mocked(mockDb.saveUser).mockResolvedValue();
        vi.mocked(mockEmail.sendEmail).mockResolvedValue(true);

        const result = await userService.createUser("1", "Miko", "miko@example.com");

        expect(result.success).toBe(true);
        expect(result.message).toBe("User created and welcome email sent");

        // Verify mock calls
        expect(mockEmail.validateEmail).toHaveBeenCalledWith("miko@example.com");
        expect(mockDb.findUser).toHaveBeenCalledWith("1");
        expect(mockDb.saveUser).toHaveBeenCalledWith({ id: "1", name: "Miko" });
        expect(mockEmail.sendEmail).toHaveBeenCalledWith(
          "miko@example.com",
          "Welcome!",
          "Hello Miko, welcome to our service!",
        );
      });

      it("should fail with invalid email", async () => {
        vi.mocked(mockEmail.validateEmail).mockReturnValue(false);

        const result = await userService.createUser("1", "Miko", "invalid-email");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Invalid email address");

        // Verify that other methods were not called
        expect(mockDb.findUser).not.toHaveBeenCalled();
        expect(mockDb.saveUser).not.toHaveBeenCalled();
      });

      it("should fail when user already exists", async () => {
        vi.mocked(mockEmail.validateEmail).mockReturnValue(true);
        vi.mocked(mockDb.findUser).mockResolvedValue({
          id: "1",
          name: "Existing User",
        });

        const result = await userService.createUser("1", "Miko", "miko@example.com");

        expect(result.success).toBe(false);
        expect(result.message).toBe("User already exists");
        expect(mockDb.saveUser).not.toHaveBeenCalled();
      });

      it("should handle email sending failure", async () => {
        vi.mocked(mockEmail.validateEmail).mockReturnValue(true);
        vi.mocked(mockDb.findUser).mockResolvedValue(null);
        vi.mocked(mockDb.saveUser).mockResolvedValue();
        vi.mocked(mockEmail.sendEmail).mockResolvedValue(false);

        const result = await userService.createUser("1", "Miko", "miko@example.com");

        expect(result.success).toBe(true);
        expect(result.message).toBe("User created but email failed");
      });

      it("should remove user successfully", async () => {
        vi.mocked(mockDb.findUser).mockResolvedValue({ id: "1", name: "Miko" });
        vi.mocked(mockDb.deleteUser).mockResolvedValue(true);

        const result = await userService.removeUser("1");

        expect(result).toBe(true);
        expect(mockDb.findUser).toHaveBeenCalledWith("1");
        expect(mockDb.deleteUser).toHaveBeenCalledWith("1");
      });

      it("should fail to remove non-existent user", async () => {
        vi.mocked(mockDb.findUser).mockResolvedValue(null);

        const result = await userService.removeUser("999");

        expect(result).toBe(false);
        expect(mockDb.deleteUser).not.toHaveBeenCalled();
      });
    });

    describe("Function mocking and spying", () => {
      it("should mock callback function", () => {
        const mockCallback = vi.fn((item: string) => item.toUpperCase());
        const items = ["hello", "world"];

        const result = processWithCallback(items, mockCallback);

        expect(result).toEqual(["HELLO", "WORLD"]);
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenNthCalledWith(1, "hello", 0, items);
        expect(mockCallback).toHaveBeenNthCalledWith(2, "world", 1, items);
      });

      it("should spy on console.log", () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        logMessage("Test message");

        expect(logSpy).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^\[.*\] Test message$/));

        logSpy.mockRestore();
      });

      it("should mock custom logger", () => {
        const mockLogger = vi.fn();

        logMessage("Custom log message", mockLogger);

        expect(mockLogger).toHaveBeenCalledWith(
          expect.stringMatching(/^\[.*\] Custom log message$/),
        );
      });
    });

    describe("EventEmitter with spies", () => {
      let emitter: EventEmitter;

      beforeEach(() => {
        emitter = new EventEmitter();
      });

      it("should call event listeners", () => {
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        emitter.on("test", listener1);
        emitter.on("test", listener2);

        emitter.emit("test", "arg1", "arg2");

        expect(listener1).toHaveBeenCalledWith("arg1", "arg2");
        expect(listener2).toHaveBeenCalledWith("arg1", "arg2");
      });

      it("should not call listeners for different events", () => {
        const listener = vi.fn();

        emitter.on("event1", listener);
        emitter.emit("event2", "data");

        expect(listener).not.toHaveBeenCalled();
      });
    });

    describe("Mock implementation and return values", () => {
      it("should demonstrate different mock return value methods", () => {
        const mockFn = vi.fn();

        // Different ways to set return values
        mockFn.mockReturnValue("static value");
        expect(mockFn()).toBe("static value");

        mockFn.mockReturnValueOnce("once value").mockReturnValue("default value");
        expect(mockFn()).toBe("once value");
        expect(mockFn()).toBe("default value");

        mockFn.mockImplementation((arg: string) => `processed: ${arg}`);
        expect(mockFn("test")).toBe("processed: test");
      });

      it("should demonstrate mock resolved values", async () => {
        const asyncMock = vi.fn();

        asyncMock.mockResolvedValue("async result");
        expect(await asyncMock()).toBe("async result");

        asyncMock.mockRejectedValue(new Error("async error"));
        await expect(asyncMock()).rejects.toThrow("async error");
      });
    });
  });
}
