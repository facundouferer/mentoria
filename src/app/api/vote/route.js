import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(request) {
  const connection = await pool.getConnection();
  const { entryId, parsedVote } = await request.json();

  // Validación, por las dudas
  if (!entryId || typeof parsedVote !== "number") {
    throw new Error("Invalid input data");
  }

  try {
    const [result] = await connection.execute(
      "UPDATE entries SET valoracion = valoracion + ?  WHERE id = ?",
      [parsedVote, entryId]
    );

    if (result.affectedRows === 0) {
      throw new Error("No se ha encontrado el artículo");
    }

    console.log(`Received vote: ${parsedVote} for entry: ${entryId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Error al procesar el voto" },
      { status: 500 }
    );
  }
}
