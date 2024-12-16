"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VoteButtons from "@/components/VoteButtons";
import ReportButton from "@/components/ReportButton";
// import Footer from "@/components/ui/Footer";

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/entries/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.entry);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error al cargar el post");
        setLoading(false);
      });
  }, [params.id]);

  // Reporte de artículo
  const handleReport = async () => {
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.titulo,
          id: params.id,
          url: window.location.href,
        }),
      });

      if (!response.ok) throw new Error("Error al enviar el reporte");

      setSnackbar({
        open: true,
        message: "Artículo enviado para revisión",
        severity: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "Error al enviar el reporte",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post no encontrado</div>;

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon props={{ post, handleReport }} />}
          >
            Volver
          </Button>

          {/* Reportar */}
          <Tooltip title="Reportar contenido incorrecto">
            <ReportButton props={{ handleReport, post }} />
          </Tooltip>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {post.titulo}
            </Typography>

            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.bajada }}
            />

            {post.img_local && (
              <CardMedia
                component="img"
                image={post.img_local}
                alt={post.titulo}
                sx={{
                  borderRadius: 1,
                }}
              />
            )}

            <div dangerouslySetInnerHTML={{ __html: post.desarrollo }} />

            {post.preguntas && (
              <>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Preguntas
                </Typography>
                <div dangerouslySetInnerHTML={{ __html: post.preguntas }} />
              </>
            )}

            {/* Botón de votación */}
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <VoteButtons entryId={params.id} initialVote={post.userVote} />
            </Box>

            <Box sx={{ mt: 3, color: "text.secondary" }}>
              <Typography variant="body2">
                Categoría: {post.categoria}
              </Typography>
              <Typography variant="body2">
                Fecha: {new Date(post.created).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
