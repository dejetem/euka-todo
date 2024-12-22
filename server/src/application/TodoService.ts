import { PaginatedResponse, Todo } from "../domain/Todo";
import { TodoError, TodoErrorCode } from "../infrastructure/middleware/todoErrorHandler";
import { TodoRepo } from "../infrastructure/repositories/todoRepo";
import { v4 as uuid } from "uuid";

// Custom error class for better error handling
export class TodoNotFoundError extends Error {
    constructor(id: string) {
        super(`Todo with id ${id} not found`);
        this.name = 'TodoNotFoundError';
    }
}

// Define valid status types
export type TodoStatus = 'Unfinished' | 'Done';

// Define update payload type
export interface TodoUpdatePayload {
    content?: string;
    status?: TodoStatus;
    dueDate?: string;
}

export class TodoService {
    static async getPaginated(
        page: number = 1,
        limit: number = 10,
        userId: string
    ): Promise<PaginatedResponse<Todo>> {
        const { todos, total, page: safePage, totalPages } = await TodoRepo.getAll(page, limit, userId);
        
        return {
            data: todos,
            metadata: {
                total,
                page: safePage,
                totalPages,
                limit
            }
        };
    }

    static async create(content: string, userId: string, dueDate?: string): Promise<Todo> {
        const newTodo: Todo = {
            id: uuid(),
            userId,
            content,
            dueDate,
            status: 'Unfinished',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await TodoRepo.create(newTodo);
        return newTodo;
    }

    static async update(
        id: string,
        updates: TodoUpdatePayload,
        userId: string
    ): Promise<Todo> {
        const todo = await TodoRepo.getById(id);
        if (!todo) {
            throw new TodoError(
                `Todo with id ${id} not found`,
                TodoErrorCode.TODO_NOT_FOUND
            );
        }

        // Validate status if provided
        if (updates.status && !['Unfinished', 'Done'].includes(updates.status)) {
            throw new TodoError(
                `Invalid status value`,
                TodoErrorCode.INVALID_STATUS_VALUE
            );
        }

        // Validate due date if provided
        if (updates.dueDate) {
            try {
                new Date(updates.dueDate);
            } catch {
                throw new TodoError(
                    `Invalid due date format`,
                    TodoErrorCode.INVALID_DATE_VALUE
                );
            }
        }

       // Create cleaned update payload
       const cleanedUpdates: Partial<Todo> = {
        ...Object.entries(updates)
            .filter(([, value]) => value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        updatedAt: new Date().toISOString(),
    };

        const updatedTodo = await TodoRepo.update(id, cleanedUpdates, userId);
        if (!updatedTodo) {
            throw new TodoError(
                `Todo with id ${id} not found`,
                TodoErrorCode.TODO_NOT_FOUND
            );
        }

        return updatedTodo;
    }

    static async delete(id: string, userId:string): Promise<Todo> {
        const deletedTodo = await TodoRepo.delete(id, userId);
        if (!deletedTodo) {
            throw new TodoError(
                `Todo with id ${id} not found`,
                TodoErrorCode.TODO_NOT_FOUND
            );
        }

        return deletedTodo;
    }

    static async getById(id: string): Promise<Todo> {
        const todo = await TodoRepo.getById(id);
        if (!todo) {
            throw new TodoError(
                `Todo with id ${id} not found`,
                TodoErrorCode.TODO_NOT_FOUND
            );
        }

        return todo;
    }
}