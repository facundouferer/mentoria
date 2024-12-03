import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT id, titulo, bajada, categoria, categoria_y_tema, desarrollo, img_prompt, img_remota, img_local, preguntas, created, modified FROM entries WHERE id = ?',
      [params.id]
    );
    
    connection.release();
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ entry: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Error al obtener el post' },
      { status: 500 }
    );
  }
} 