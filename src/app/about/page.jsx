import React from "react";
import { Container, Box } from "@mui/material";

function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <title>Acerca de nosotros</title>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ justifyContent: "space-between", mb: 4 }}>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-600 border-b-2 border-blue-400 pb-2 mb-4">
              Acerca de nosotros
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Este sitio ha sido creado especialmente para estudiantes y
              educadores por el personal del Ministerio de Educación, Cultura,
              Ciencia y Tecnología de la Provincia del Chaco, con el objetivo de
              facilitar el acceso a contenido educativo innovador y
              autogenerado. Aquí podrás explorar una amplia variedad de
              artículos diseñados para enriquecer tu aprendizaje de una manera
              práctica y accesible.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 border-b-2 border-blue-400 pb-2 mb-4">
              Propósito
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              La finalidad de esta página es proveer artículos educativos de
              manera automática, incorporando contenidos de diferentes fuentes y
              formatos, para permitir el aprendizaje autogestionado durante la
              época de vacaciones de verano. Cada artículo cuenta con una
              descripción breve, una imagen, un desarrollo y preguntas para
              facilitar la comprensión del contenido.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Es importante recordar que, al ser generados por IA, los artículos
              no son auténticos y no tienen la misma calidad que los creados por
              humanos. Sin embargo, son una herramienta útil para la educación y
              el aprendizaje en general. Por esto, es fundamental utilizarlos
              con responsabilidad y complementar su uso con fuentes confiables y
              verificables para garantizar la calidad de los contenidos.
            </p>
          </section>
          <section className="mt-12 max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Equipo de desarrollo
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              <b>Despliegue:</b> Guillermo Rohde y Facundo Uferer
              <br></br>
              <b>Desarrollo:</b> Almenar Ignacio y Facundo Uferer
            </p>
          </section>
        </Box>
      </Container>
    </div>
  );
}

export default About;
