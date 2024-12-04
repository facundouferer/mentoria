import RootLayoutClient from "./RootLayoutClient";

export const metadata = {
  title: "TutorIA",
  description: "Contenido educativo creado con Inteligencia Artificial",
};

export default function RootLayout({ children }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
