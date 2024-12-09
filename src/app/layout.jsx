import RootLayoutClient from "./RootLayoutClient";
import "./globals.css";

export const metadata = {
  title: "TutorIA",
  description: "Contenido educativo creado con Inteligencia Artificial",
};

export default function RootLayout({ children }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
