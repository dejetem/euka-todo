"use client"
import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export default function AuthPage() {
    const [tab, setTab] = useState(0);

    return (
        <ProtectedRoute requireAuth={false}>
        <Box maxWidth={400} mx="auto">
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
            </Tabs>
            <AuthForm mode={tab === 0 ? 'signin' : 'signup'} />
        </Box>
        </ProtectedRoute>
    );
}