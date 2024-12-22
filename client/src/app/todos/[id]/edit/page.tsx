"use client"
import { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { todosApi } from '@/infrastructure/api/todos';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export default function EditTodoPage({ params }: { params: { id: string } }) {
    const [content, setContent] = useState('');
    const [dueDate, setDueDate] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const todo = await todosApi.getTodos(1, 1);
                if (todo.data[0]) {
                    setContent(todo.data[0].content);
                    setDueDate(todo.data[0].dueDate || '');
                }
            } catch (error) {
                const axiosError = error as AxiosError;
                if (!axiosError.response) {
                    toast.error("No Server Response");
                } else if (axiosError.response?.status === 400) {
                    toast.error("Invalid Request");
                } else if (axiosError.response?.status === 401) {
                    toast.error("Unauthorized");
                } else {
                    toast.error("Failed to fetch todo");
                }

            }
        };

        if (params.id !== 'new') {
            fetchTodo();
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (params.id === 'new') {
                await todosApi.createTodo({ content, dueDate });
            } else {
                await todosApi.updateTodo(params.id, { content, dueDate });
            }
            router.push('/');
        } catch (error) {
            const axiosError = error as AxiosError;
            if (!axiosError.response) {
                toast.error("No Server Response");
            } else if (axiosError.response?.status === 400) {
                toast.error("Invalid Request");
            } else if (axiosError.response?.status === 401) {
                toast.error("Unauthorized");
            } else {
                toast.error("Failed to save todo");
            }

        }
    };

    return (
        <ProtectedRoute>
            <Box component="form" onSubmit={handleSubmit} maxWidth={600} mx="auto">
                <TextField
                    fullWidth
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    type="date"
                    label="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Box display="flex" gap={2} mt={3}>
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => router.push('/')}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </ProtectedRoute>
    );
}