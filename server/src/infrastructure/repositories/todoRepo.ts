import fs from "fs";
import path from "path";
import { Todo } from "../../domain/Todo";

// Custom error classes for better error handling
export class TodoStorageError extends Error {
    constructor(message: string, public readonly cause?: Error) {
        super(message);
        this.name = 'TodoStorageError';
    }
}

export class TodoRepo {
    private static readonly STORAGE_DIR = path.join(__dirname, "../storage");
    private static readonly TODO_DB = path.join(TodoRepo.STORAGE_DIR, "todos.json");

    /**
     * Initialize the storage directory and database file
     */
    private static initializeStorage(): void {
        try {
            // Create storage directory if it doesn't exist
            if (!fs.existsSync(TodoRepo.STORAGE_DIR)) {
                fs.mkdirSync(TodoRepo.STORAGE_DIR, { recursive: true });
            }

            // Create todos.json if it doesn't exist
            if (!fs.existsSync(TodoRepo.TODO_DB)) {
                fs.writeFileSync(TodoRepo.TODO_DB, "[]", "utf-8");
            }
        } catch (error) {
            throw new TodoStorageError(
                "Failed to initialize storage",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Read todos from the JSON file
     */
    private static readData(): Todo[] {
        try {
            TodoRepo.initializeStorage();
            const data = fs.readFileSync(TodoRepo.TODO_DB, "utf-8");
            const todos = JSON.parse(data) as Todo[];

            // Validate the data structure
            if (!Array.isArray(todos)) {
                throw new Error("Invalid data structure in storage");
            }

            return todos;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new TodoStorageError("Invalid JSON in storage file");
            }
            throw new TodoStorageError(
                "Failed to read todos",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Write todos to the JSON file
     */
    private static writeData(todos: Todo[]): void {
        try {
            TodoRepo.initializeStorage();
            fs.writeFileSync(
                TodoRepo.TODO_DB,
                JSON.stringify(todos, null, 2),
                "utf-8"
            );
        } catch (error) {
            throw new TodoStorageError(
                "Failed to write todos",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Create a new todo
     */
    static async create(todo: Todo): Promise<Todo> {
        try {
            const todos = TodoRepo.readData();
            // Check for duplicate ID
            if (todos.some(t => t.id === todo.id)) {
                throw new TodoStorageError(`Todo with ID ${todo.id} already exists`);
            }
            todos.push(todo);
            TodoRepo.writeData(todos);
            return todo;
        } catch (error) {
            if (error instanceof TodoStorageError) throw error;
            throw new TodoStorageError(
                "Failed to create todo",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Update an existing todo
     */
    static async update(id: string, updatedData: Partial<Todo>, userId: string): Promise<Todo | null> {
        try {
            const todos = TodoRepo.readData();
            const index = todos.findIndex(todo => todo.id === id && todo.userId === userId);

            if (index === -1) return null;


            // Ensure we don't modify the id
            const { id: _, ...safeUpdateData } = updatedData;

            todos[index] = {
                ...todos[index],
                ...safeUpdateData,
                updatedAt: new Date().toISOString()
            };

            TodoRepo.writeData(todos);
            return todos[index];
        } catch (error) {
            throw new TodoStorageError(
                "Failed to update todo",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Get a todo by ID
     */
    static async getById(id: string): Promise<Todo | null> {
        try {
            const todos = TodoRepo.readData();
            return todos.find(todo => todo.id === id) || null;
        } catch (error) {
            throw new TodoStorageError(
                "Failed to get todo",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Get paginated todos
     */
    static async getAll(page: number = 1, limit: number = 10, userId: string): Promise<{
        todos: Todo[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        try {
            const todos = TodoRepo.readData();
            const userTodos = todos
                .filter(todo => todo.userId === userId) // Filter todos by userId
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by `createdAt` in descending order
            const total = userTodos.length;
            const totalPages = Math.ceil(total / limit);
            const safePage = Math.max(1, Math.min(page, totalPages));
            const start = (safePage - 1) * limit;
            const paginatedTodos = userTodos.slice(start, start + limit);

            return {
                todos: paginatedTodos,
                total,
                page: safePage,
                totalPages
            };
        } catch (error) {
            throw new TodoStorageError(
                "Failed to get todos",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Delete a todo by ID
     */
    static async delete(id: string, userId: string): Promise<Todo | null> {
        try {
            const todos = TodoRepo.readData();
            const index = todos.findIndex(todo => todo.id === id && todo.userId === userId);

            if (index === -1) return null;

            const [deletedTodo] = todos.splice(index, 1);
            TodoRepo.writeData(todos);

            return deletedTodo;
        } catch (error) {
            throw new TodoStorageError(
                "Failed to delete todo",
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Clean up all todos 
     */
    static async clear(): Promise<void> {
        try {
            TodoRepo.writeData([]);
        } catch (error) {
            throw new TodoStorageError(
                "Failed to clear todos",
                error instanceof Error ? error : undefined
            );
        }
    }
}