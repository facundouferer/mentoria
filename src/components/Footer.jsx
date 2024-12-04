import { Container, Grid, Box, Link, Typography } from "@mui/material";
import Image from "next/image";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "primary.main", color: "white", py: 4, mt: "auto" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Enlaces útiles
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "white" }}
                >
                  Inicio
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "white" }}
                >
                  Acerca de nosotros
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  href="#"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "white" }}
                >
                  Contacto
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Menú Principal
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  href="/noticias"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "white" }}
                >
                  Noticias
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  href="/documentos"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "white" }}
                >
                  Documentos
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  href="/informacion"
                  color="inherit"
                  underline="hover"
                  sx={{ color: "white" }}
                >
                  Información
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/logogobiernoyministerio.png"
              alt="Logo Gobierno"
              width={300}
              height={100}
              style={{ objectFit: "contain" }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
