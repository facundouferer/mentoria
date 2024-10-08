import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const sql = 'SELECT * FROM entries WHERE id = ?';
    const result = await query(sql, [id]);

    if (result.length === 0) {
      return NextResponse.json({ message: 'Artículo no encontrado' }, { status: 404 });
    }

    const entry = result[0];
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error al obtener el artículo:', error);
    return NextResponse.json({ error: 'Error Interno del Servidor' }, { status: 500 });
  }
}
