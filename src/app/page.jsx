'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box,
} from '@mui/material';

export default function Home() {
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchEntries = async (page, limit, category = null) => {
    try {
      const url = new URL('/api/entries', window.location.origin);
      url.searchParams.set('page', page);
      url.searchParams.set('limit', limit);
      if (category) url.searchParams.set('category', category);
      
      const search = searchParams.get('search');
      if (search) url.searchParams.set('search', search);

      const response = await fetch(url);
      const data = await response.json();
      setEntries(data.entries || []);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page when search changes
    fetchEntries(1, itemsPerPage, selectedCategory);
  }, [searchParams, itemsPerPage, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!entries || entries.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {searchParams.get('search') 
            ? `No hay resultados para "${searchParams.get('search')}"`
            : 'No hay entradas disponibles'}
        </Typography>
        {searchParams.get('search') && (
          <Button
            onClick={() => window.location.href = '/'}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Volver al inicio
          </Button>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {searchParams.get('search') 
          ? `Resultados para "${searchParams.get('search')}"`
          : selectedCategory 
            ? `Artículos en ${selectedCategory}` 
            : 'Entradas del Blog'}
      </Typography>
      
      {(selectedCategory || searchParams.get('search')) && (
        <Button
          onClick={() => window.location.href = '/'}
          startIcon="←"
          sx={{ mb: 2 }}
        >
          Volver a todas las entradas
        </Button>
      )}
      
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Items por página</InputLabel>
          <Select
            value={itemsPerPage}
            label="Items por página"
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <MenuItem value={4}>4 por página</MenuItem>
            <MenuItem value={6}>6 por página</MenuItem>
            <MenuItem value={8}>8 por página</MenuItem>
            <MenuItem value={10}>10 por página</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {entries?.map(entry => (
          <Grid item key={entry.id} xs={12} sm={6}>
            <Card>
              {entry.img_local && (
                <CardMedia
                  component="img"
                  height="200"
                  image={entry.img_local}
                  alt={entry.titulo}
                  sx={{
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              )}
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component={Link}
                  href={`/post/${entry.id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {entry.titulo}
                </Typography>
                <div
                  className="text-gray-600 mb-3"
                  dangerouslySetInnerHTML={{ __html: entry.bajada }}
                />
                <Button
                  size="small"
                  onClick={() => handleCategoryClick(entry.categoria)}
                  sx={{ mt: 1 }}
                >
                  Categoría: {entry.categoria}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}
