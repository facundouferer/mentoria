'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Box,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/entries/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data.entry);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error al cargar el post');
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post no encontrado</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 4 }}
      >
        Volver
      </Button>
      
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
                maxHeight: 400, 
                objectFit: 'cover',
                my: 3,
                borderRadius: 1
              }}
            />
          )}
          
          <div
            dangerouslySetInnerHTML={{ __html: post.desarrollo }}
          />
          
          {post.preguntas && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Preguntas
              </Typography>
              <div
                dangerouslySetInnerHTML={{ __html: post.preguntas }}
              />
            </>
          )}
          
          <Box sx={{ mt: 3, color: 'text.secondary' }}>
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
  );
} 