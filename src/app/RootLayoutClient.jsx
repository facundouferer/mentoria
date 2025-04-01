'use client';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

export default function RootLayoutClient({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    // Revisar si hay un modo guardado en localStorage
    const savedMode = localStorage.getItem('color-mode');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    setMode(savedMode || systemPreference);

    // Escuchar cambios en el sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('color-mode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('color-mode', newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SessionProvider> {/* Wrap your content with SessionProvider */}
            <Navbar mode={mode} toggleColorMode={toggleColorMode} />
            <main className="container mx-auto px-4">
              {children}
            </main>
            <Footer mode={mode} toggleColorMode={toggleColorMode} />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}