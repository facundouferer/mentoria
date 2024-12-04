"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";
import Footer from "../components/Footer";

export default function Home() {
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchEntries = async (page, limit, category = null) => {
    try {
      setLoading(true);
      const url = new URL("/api/entries", window.location.origin);
      url.searchParams.set("page", page);
      url.searchParams.set("limit", limit);
      if (category) url.searchParams.set("category", category);

      const search = searchParams.get("search");
      if (search) url.searchParams.set("search", search);

      const response = await fetch(url);
      const data = await response.json();
      setEntries(data.entries || []);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar los datos");
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchEntries(1, itemsPerPage, selectedCategory);
  }, [searchParams, itemsPerPage, selectedCategory]);

  useEffect(() => {
    fetchEntries(currentPage, itemsPerPage, selectedCategory);
  }, [currentPage]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para extraer el texto de un HTML sin los tags
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Círculo de carga
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
  if (!entries || entries.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {searchParams.get("search")
            ? `No hay resultados para "${searchParams.get("search")}"`
            : "No hay entradas disponibles"}
        </Typography>
        {searchParams.get("search") && (
          <Button
            onClick={() => (window.location.href = "/")}
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
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {searchParams.get("search")
            ? `Resultados para "${searchParams.get("search")}"`
            : selectedCategory
            ? `Artículos de ${selectedCategory}`
            : "Artículos"}
        </Typography>

        {(selectedCategory || searchParams.get("search")) && (
          <Button
            onClick={() => (window.location.href = "/")}
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
            {/* Múltiplo de 3 ya que se muestran tres columnas */}
            <MenuItem value={3}>3 por página</MenuItem>
            <MenuItem value={6}>6 por página</MenuItem>
            <MenuItem value={9}>9 por página</MenuItem>
            <MenuItem value={12}>12 por página</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Media Card */}
      <Grid container spacing={3}>
        {entries?.map((entry) => (
          <Grid item key={entry.id} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {entry.img_local && (
                <CardMedia
                  component="img"
                  height="200"
                  image={entry.img_local}
                  alt={entry.titulo}
                  sx={{
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  <Link
                    href={`/post/${entry.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {entry.titulo}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stripHtml(entry.bajada).substring(0, 300)}
                  ...
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "space-between", // Spread the buttons
                  alignItems: "center", // Align items vertically centered
                }}
              >
                <Button
                  size="small"
                  onClick={() => handleCategoryClick(entry.categoria)}
                  sx={{
                    width: "250px", // Set fixed width
                    height: "40px", // Set fixed height
                    fontSize: "0.875rem", // Smaller font size
                    textAlign: "left", // Align text to the left
                    justifyContent: "flex-start", // Ensures text aligns left in a flex container
                  }}
                >
                  {entry.categoria}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  href={`/post/${entry.id}`}
                  sx={{
                    width: "95px", // Set fixed width
                    height: "40px", // Set fixed height
                    textAlign: "center", // Ensure text is centered
                    fontWeight: "bold", // Make text bold
                    ml: "auto", // Push to the right
                  }}
                >
                  Leer más
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

        {pagination && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
}
