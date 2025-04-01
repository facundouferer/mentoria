"use client";
import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Container,
  Button,
  Box,
  CircularProgress,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function EditPostPage(props) {
  const params = use(props.params);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [bajada, setBajada] = useState("");
  const [questions, setQuestions] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  // Editor de texto enriquecido para el desarrollo
  const desarrolloEditor = useEditor({
    extensions: [StarterKit],
    content: post?.desarrollo || "<p>Cargando...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setPost({ ...post, desarrollo: editor.getHTML() });
    },
  });

  // Editor de texto enriquecido para la bajada
  const bajadaEditor = useEditor({
    extensions: [StarterKit],
    content: post?.bajada || "<p>Cargando...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setPost({ ...post, bajada: editor.getHTML() });
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/entries/${params.id}`);
        const data = await response.json();
        if (data.entry) {
          setPost(data.entry);
          setTitle(data.entry.titulo);
          setBajada(data.entry.bajada);
          setQuestions(data.entry.preguntas);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error obteniendo el post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  useEffect(() => {
    if (desarrolloEditor && post?.desarrollo) {
      desarrolloEditor.commands.setContent(post.desarrollo);
    }
    if (bajadaEditor && post?.bajada) {
      bajadaEditor.commands.setContent(post.bajada);
    }
  }, [desarrolloEditor, post?.desarrollo, bajadaEditor, post?.bajada]);

  // Handlers
  const handleUpdate = async () => {
    if (!session?.user || post?.userId !== session?.user?.id) {
      alert("No tienes permisos para modificar este post.");
      return;
    }

    try {
      const response = await fetch(`/api/entries/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: title,
          bajada: post.bajada,
          desarrollo: post.desarrollo,
          preguntas: questions,
        }),
      });

      if (response.ok) {
        router.push(`/post/${params.id}`);
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
        const response = await fetch(`/api/entries/${params.id}`, {
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
    // Título
    <Container maxWidth="md" sx={{ mt: 4 }} className="mb-4">
      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <h2 className="text-2xl font-semibold">Bajada</h2>
      <Paper variant="outlined" sx={{ padding: "10px", marginTop: "10px" }}>
        {bajadaEditor && <EditorContent editor={bajadaEditor} />}
      </Paper>
      <h2 className="text-2xl font-semibold">Desarrollo</h2>
      <Paper variant="outlined" sx={{ padding: "10px", marginTop: "10px" }}>
        {desarrolloEditor && <EditorContent editor={desarrolloEditor} />}
      </Paper>
      <TextField
        label="Preguntas"
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Actualizar
        </Button>
        <Button
          variant="outlined"
          onClick={handleDelete}    
          color="error"
          startIcon={<DeleteIcon />}
        >
          Borrar
        </Button>
        <Button variant="outlined" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Ocultar Vista Previa" : "Mostrar Vista Previa"}
        </Button>
      </Box>

      {showPreview && post?.desarrollo && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: bajada }} />
          <div dangerouslySetInnerHTML={{ __html: post.desarrollo }} />
          {questions && (
            <>
              <Typography variant="h6" component="h3" gutterBottom>
                Preguntas
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: questions }} />
            </>
          )}
        </Paper>
      )}
    </Container>
  );
}
