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

export async function PATCH(request, props) {
  const params = await props.params;
  try {
    const data = await request.json();
    const connection = await pool.getConnection();

    let updateQuery = 'UPDATE entries SET modified = NOW()';
    const values = [];

    if (data.titulo) {
      updateQuery += ', titulo = ?';
      values.push(data.titulo);
    }
    if (data.bajada) {
      updateQuery += ', bajada = ?';
      values.push(data.bajada);
    }
    if (data.categoria) {
      updateQuery += ', categoria = ?';
      values.push(data.categoria);
    }
    if (data.categoria_y_tema) {
      updateQuery += ', categoria_y_tema = ?';
      values.push(data.categoria_y_tema);
    }
    if (data.desarrollo) {
      updateQuery += ', desarrollo = ?';
      values.push(data.desarrollo);
    }
    if (data.img_prompt) {
      updateQuery += ', img_prompt = ?';
      values.push(data.img_prompt);
    }
    if (data.img_remota) {
      updateQuery += ', img_remota = ?';
      values.push(data.img_remota);
    }
    if (data.img_local) {
      updateQuery += ', img_local = ?';
      values.push(data.img_local);
    }
    if (data.preguntas) {
      updateQuery += ', preguntas = ?';
      values.push(data.preguntas);
    }

    updateQuery += ' WHERE id = ?';
    values.push(params.id);

    await connection.execute(updateQuery, values);

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
