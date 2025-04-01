import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, props) {
  const params = await props.params;
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

export async function PUT(request, props) {
  const params = await props.params;
  try {
    const { titulo, bajada, categoria, categoria_y_tema, desarrollo, img_prompt, img_remota, img_local, preguntas } = await request.json();
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE entries SET titulo = ?, bajada = ?, categoria = ?, categoria_y_tema = ?, desarrollo = ?, img_prompt = ?, img_remota = ?, img_local = ?, preguntas = ?, modified = NOW() WHERE id = ?',
      [titulo, bajada, categoria, categoria_y_tema, desarrollo, img_prompt, img_remota, img_local, preguntas, params.id]
    );

    connection.release();

    return NextResponse.json({ message: 'Post actualizado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar el post:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM entries WHERE id = ?', [params.id]);

    connection.release();

    return NextResponse.json({ message: 'Post eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el post:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el post' },
      { status: 500 }
    );
  }
}
