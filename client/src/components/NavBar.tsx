'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <AppBar position="static">
        <Toolbar />
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          onClick={() => router.push(`/`)} 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
        >
          Todo App
        </Typography>
        {isAuthenticated && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}