
import { AppBar, Container } from '@mui/material';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "react-hot-toast";
import NavBar from '@/components/NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <Toaster />
          <Container maxWidth="md" sx={{ mt: 4 }}>
            {children}
          </Container>
        </AuthProvider>
      </body>
    </html>
  );
}