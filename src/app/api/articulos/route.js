import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const PAGE_SIZE = 10; // Tamaño de página fijo

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const page = parseInt(searchParams.get('page')) || 1;
    const offset = (page - 1) * PAGE_SIZE;

    let sql = 'SELECT * FROM entries';
    let countSql = 'SELECT COUNT(*) as total FROM entries';
    let params = [];
    let countParams = [];

    // En caso de pasarle por parametro un keyword, se busca en el titulo y desarrollo
    if (keyword) {
      sql += ' WHERE title LIKE ? OR content LIKE ?';
      countSql += ' WHERE title LIKE ? OR content LIKE ?';
      params = [`%${keyword}%`, `%${keyword}%`];
      countParams = [`%${keyword}%`, `%${keyword}%`];
    }

    // Se limita la cantidad de registros que se van a obtener
    sql += ' LIMIT ? OFFSET ?';
    params.push(PAGE_SIZE, offset);

    const [entries, countResult] = await Promise.all([
      query(sql, params),
      query(countSql, countParams)
    ]);

    // Se obtiene la cantidad total de registros
    const total = countResult[0].total;
    // Se calcula la cantidad total de paginas
    const totalPages = Math.ceil(total / PAGE_SIZE);

    if (entries.length === 0) {
      return NextResponse.json({ message: 'No se encontraron artículos' }, { status: 404 });
    }

    // Se retorna el articulo junto con la cantidad total de paginas, la cantidad de registros por pagina, la pagina actual y la cantidad total de registros
    return NextResponse.json({
      entries,
      pagination: {
        currentPage: page,
        pageSize: PAGE_SIZE,
        totalPages,
        totalEntries: total
      }
    });
  } catch (error) {
    console.error('Error al obtener los artículos:', error);
    return NextResponse.json({ error: 'Error Interno del Servidor' }, { status: 500 });
  }
}
