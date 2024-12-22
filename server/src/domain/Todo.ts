export interface Todo {
    id: string;
    userId: string;
    content: string;
    dueDate?: string;
    status: "Unfinished" | "Done";
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    metadata: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}

export type TodoStatus = 'Unfinished' | 'Done';

export interface TodoUpdatePayload {
    content?: string;
    status?: TodoStatus;
    dueDate?: string;
}
