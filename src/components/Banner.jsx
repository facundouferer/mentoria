import { Box, Typography, Container } from "@mui/material";
import Image from "next/image";

export default function Banner() {
  return (
    <>
      <Container
        className="rounded-lg mt-4 border-4 border-blue-400"
        maxWidth="lg"
        sx={{ py: 2 }}
      >
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: { xs: "center", md: "left" },
                px: 1,
                maxWidth: { xs: "100%", md: "40%" },
              }}
            >
              Los textos e imágenes de este sitio son creados con inteligencia
              artificial, pero no reemplazan la labor docente. El trabajo humano
              es clave para aportar experiencia, sensibilidad y enfoque
              educativo.
            </Typography>
            <Image
              src="/imagenes-07.png"
              alt="Banner"
              width={0}
              height={0}
              style={{ width: "40%", height: "auto" }}
              priority
              className="ocultoEnMovil"
            />
            <Image
              src="/imagenes-04.png"
              alt="Banner"
              width={0}
              height={0}
              style={{ width: "30%", height: "auto" }}
              className="ocultoEnMovil"
            />
          </Box>
        </Box>
      </Container>
    </>
  );
}
