import RootLayoutClient from "./RootLayoutClient";

export const metadata = {
  title: "MentorIA",
  description: "Contenido educativo creado con Inteligencia Artificial",
};

export default function RootLayout({ children }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
