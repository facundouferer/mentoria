"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Container,
  Button,
  Box,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TiptapEditor from "@/components/Tiptap";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [bajada, setBajada] = useState("");
  const [desarrollo, setDesarrollo] = useState("");
  const [questions, setQuestions] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/entries/${id}`);
        const data = await res.json();
        const entry = data.entry;
        setPost(entry);
        setTitle(entry.titulo);
        setBajada(entry.bajada);
        setDesarrollo(entry.desarrollo);
        setQuestions(entry.preguntas);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    if (!session?.user || post?.userId !== session?.user?.id) {
      alert("No tienes permisos para modificar este post.");
      return;
    }

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: title,
          bajada,
          desarrollo,
          preguntas: questions,
        }),
      });

      if (response.ok) {
        router.push(`/post/${id}`);
      } else {
        alert("Falló al actualizar el post.");
      }
    } catch (error) {
      console.error("Error actualizando el post:", error);
    }
  };

  const handleDelete = async () => {
    if (!session?.user || post?.userId !== session?.user?.id) {
      alert("No tienes permisos para eliminar.");
      return;
    }

    if (window.confirm("¿Está seguro de querer eliminarlo?")) {
      try {
        const response = await fetch(`/api/entries/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/");
        } else {
          alert("Fallo al borrar el post.");
        }
      } catch (error) {
        console.error("Error borrando el post:", error);
      }
    }
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
        <CircularProgress />
      </Box>
    );

  if (!post) return <div>Post no encontrado</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }} className="mb-4">
      <Typography variant="h6" className="mb-2">
        Título
      </Typography>
      <Paper variant="outlined" sx={{ padding: "10px", marginTop: "10px" }}>
        <TiptapEditor content={title} onChange={setTitle} />
      </Paper>

      <Typography variant="h6" className="mt-4">
        Bajada
      </Typography>
      <Paper variant="outlined" sx={{ padding: "10px", marginTop: "10px" }}>
        <TiptapEditor content={bajada} onChange={setBajada} />
      </Paper>

      <Typography variant="h6" className="mt-4">
        Desarrollo
      </Typography>
      <Paper variant="outlined" sx={{ padding: "10px", marginTop: "10px" }}>
        <TiptapEditor content={desarrollo} onChange={setDesarrollo} />
      </Paper>

      <Typography variant="h6" className="mt-4">
        Preguntas
      </Typography>
      <Paper variant="outlined" sx={{ padding: "10px", marginTop: "10px" }}>
        <TiptapEditor content={questions} onChange={setQuestions} />
      </Paper>

      {/* Botones */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Actualizar
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
        >
          Borrar
        </Button>
        <Button variant="outlined" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Ocultar Vista Previa" : "Mostrar Vista Previa"}
        </Button>
      </Box>

      {/* Vista Previa */}
      {showPreview && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h5">{title}</Typography>
          <div dangerouslySetInnerHTML={{ __html: bajada }} />
          <div dangerouslySetInnerHTML={{ __html: desarrollo }} />
          {questions && (
            <>
              <Typography variant="h6">Preguntas</Typography>
              <div dangerouslySetInnerHTML={{ __html: questions }} />
            </>
          )}
        </Paper>
      )}
    </Container>
  );
}
