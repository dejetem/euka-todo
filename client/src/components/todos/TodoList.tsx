import { useState, useEffect } from 'react';
import { Box, Pagination, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TodoItem } from './TodoItem';
import { todosApi } from '@/infrastructure/api/todos';
import { useRouter } from 'next/navigation';
import { Todo } from '@/domain/todo/types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const ITEMS_PER_PAGE = 10;

export const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    const fetchTodos = async () => {
        try {
            const response = await todosApi.getTodos(page, ITEMS_PER_PAGE);
            setTodos(response.data);
            setTotalPages(response.metadata.totalPages);
        } catch (error) {
            const axiosError = error as AxiosError;
            
            if (!axiosError.response) {
                toast.error("No Server Response");
            } else if (axiosError.response?.status === 400) {
                toast.error("Invalid Request");
            } else if (axiosError.response?.status === 401) {
                toast.error("Unauthorized");
            } else {
                toast.error("Failed to fetch todos");
            }
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [page]);

    const handleStatusChange = async (id: string, status: 'Unfinished' | 'Done') => {
        try {
            await todosApi.updateTodo(id, { status });
            fetchTodos();
        } catch (error) {
            const axiosError = error as AxiosError;
            if (!axiosError.response) {
                toast.error("No Server Response");
            } else if (axiosError.response?.status === 400) {
                toast.error("Invalid Request");
            } else if (axiosError.response?.status === 401) {
                toast.error("Unauthorized");
            } else {
                toast.error("Failed to update todo status");
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await todosApi.deleteTodo(id);
            fetchTodos();
        } catch (error) {
            const axiosError = error as AxiosError;
            if (!axiosError.response) {
                toast.error("No Server Response");
            } else if (axiosError.response?.status === 400) {
                toast.error("Invalid Request");
            } else if (axiosError.response?.status === 401) {
                toast.error("Unauthorized");
            } else {
                toast.error("Failed to delete todo");
            }
            
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={3}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push(`/todos/new/edit`)}
                >
                    Add Todo
                </Button>
            </Box>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />
            ))}
            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </Box>
    );
};