"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
// import Footer from "../components/Footer";
import Banner from "../components/Banner";
import CardArticulo from "../components/CardArticulo";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const fetchEntries = useCallback(
    async (page, limit, category = null) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (category) params.set("category", category);

        const search = searchParams.get("search");
        if (search) params.set("search", search);

        const response = await fetch(`/api/entries?${params.toString()}`);
        const data = await response.json();
        setEntries(data.entries || []);
        setPagination(data.pagination);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    },
    [searchParams]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchEntries(1, itemsPerPage, selectedCategory);
  }, [searchParams.get("search"), itemsPerPage, selectedCategory]);

  useEffect(() => {
    fetchEntries(currentPage, itemsPerPage, selectedCategory);
  }, [currentPage, itemsPerPage, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    router.push(`/?category=${category}`);
  };

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
    router.replace(`/?${createQueryString("page", page)}`, { scroll: false });
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
      <Banner />
      <Container maxWidth="lg" sx={{ py: 1 }}>
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
            Volver al inicio
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
              <CardArticulo entry={entry} />
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
      {/* <Footer /> */}
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <HomeContent />
    </Suspense>
  );
}
