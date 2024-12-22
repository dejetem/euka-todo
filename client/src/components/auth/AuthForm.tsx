import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/infrastructure/api/auth';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
    mode: 'signin' | 'signup';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const api = mode === 'signin' ? authApi.signIn : authApi.signUp;
            const response = await api({ email, password });
            login(response.token);
            router.push('/');
        } catch (err) {
            setError('Authentication failed');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
            />
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
            >
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
        </Box>
    );
};