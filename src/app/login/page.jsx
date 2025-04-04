// app/page.js
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
} from "@mui/material";

export default function Home() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signIn("credentials", { username, password });
  };

  if (session) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}
      >
        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Typography variant="h5" gutterBottom>
            Bienvenido, {session.user.name}!
          </Typography>
          <Button variant="contained" color="error" onClick={() => signOut()}>
            Cerrar Sesión
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}
    >
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Administración
        </Typography>
        <form onSubmit={handleSignIn}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
            <TextField
              label="Usuario"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}