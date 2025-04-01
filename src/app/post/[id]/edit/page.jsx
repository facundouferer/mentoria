"use client";
import { useEffect, useState, useRef } from "react";
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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function EditPostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const tiptapEditor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: post?.desarrollo || "<p>Loading...</p>",
    onUpdate: ({ editor }) => {
      setPost({ ...post, desarrollo: editor.getHTML() });
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
          setQuestions(data.entry.preguntas);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  useEffect(() => {
    if (tiptapEditor && post?.desarrollo) {
      tiptapEditor.commands.setContent(post.desarrollo);
    }
  }, [tiptapEditor, post?.desarrollo]);

  const handleUpdate = async () => {
    if (!session?.user || post?.userId !== session?.user?.id) {
      alert("You are not authorized to edit this post.");
      return;
    }

    try {
      const response = await fetch(`/api/entries/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: title,
          desarrollo: post.desarrollo,
          preguntas: questions,
        }),
      });

      if (response.ok) {
        router.push(`/post/${params.id}`);
      } else {
        alert("Failed to update post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
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
  if (!post) return <div>Post not found</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      {tiptapEditor && <EditorContent editor={tiptapEditor} />} {/* The tiptap editor will allow editing the desarrollo part*/}
      <TextField
        label="Questions"
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </Box>

      {showPreview && post?.desarrollo && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
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