import axiosInstance from '../http/axios';
import { Todo, TodoResponse } from '@/domain/todo/types';

export const todosApi = {
  getTodos: async (page: number, limit: number) => {
    const response = await axiosInstance.get<TodoResponse>(`/todos?page=${page}&limit=${limit}`);
    return response.data;
  },

  createTodo: async (data: { content: string; dueDate?: string }) => {
    const response = await axiosInstance.post<Todo>('/todos', data);
    return response.data;
  },

  updateTodo: async (id: string, data: { content?: string; dueDate?: string; status?: string }) => {
    const response = await axiosInstance.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    await axiosInstance.delete(`/todos/${id}`);
  },
};