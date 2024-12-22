export interface Todo {
    id: string;
    userId: string;
    content: string;
    dueDate: string;
    status: 'Unfinished' | 'Done';
    createdAt: string;
    updatedAt: string;
}

export interface TodoResponse {
    data: Todo[];
    metadata: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}