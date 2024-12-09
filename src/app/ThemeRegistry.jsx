"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useColorMode } from "@/hooks/useColorMode";

export default function ThemeRegistry({ children }) {
  const { mode } = useColorMode();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
