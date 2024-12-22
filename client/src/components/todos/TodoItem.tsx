import { Todo } from '@/domain/todo/types';
import { Card, CardContent, Checkbox, Typography, IconButton, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface TodoItemProps {
    todo: Todo;
    onStatusChange: (id: string, status: 'Unfinished' | 'Done') => void;
    onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onStatusChange, onDelete }: TodoItemProps) => {
    const router = useRouter();

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Checkbox
                            checked={todo.status === 'Done'}
                            onChange={(e) =>
                                onStatusChange(todo.id, e.target.checked ? 'Done' : 'Unfinished')
                            }
                        />
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    textDecoration: todo.status === 'Done' ? 'line-through' : 'none'
                                }}
                            >
                                {todo.content}
                            </Typography>
                            {todo.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        <IconButton onClick={() => router.push(`/todos/${todo.id}/edit`)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(todo.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
