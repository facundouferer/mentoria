import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";

// Función para extraer el texto de un HTML sin los tags
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const stringToColor = (str) => {
  // Tomamos solo el texto hasta la primera coma
  const textForColor = str.split(",")[0];

  let hash = 0;
  for (let i = 0; i < textForColor.length; i++) {
    hash = textForColor.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

export default function CardArticulo({ props }) {
  const { entry, handleCategoryClick } = props;
  const categoriaColor = stringToColor(entry.categoria);

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {entry.img_local && (
          // Para que sea clickeable la imagen
          <Link href={`/post/${entry.id}`} passHref>
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
          </Link>
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
              color: categoriaColor, // Aplicamos el color aquí
              fontWeight: "bold",
              textShadow: "0px 0px 1px rgba(0, 0, 0, 0.3)",
              blurRadius: "5px",
              "&:hover": {
                color: categoriaColor, // Mantenemos el color en hover
                opacity: 0.8, // Añadimos un efecto de opacidad al hover
              },
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
    </>
  );
}
