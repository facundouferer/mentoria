import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    
    // Construir la consulta base
    let countQuery = 'SELECT COUNT(*) as total FROM entries';
    let selectQuery = 'SELECT id, titulo, bajada, categoria, categoria_y_tema, desarrollo, img_prompt, img_remota, img_local, preguntas, created, modified FROM entries';
    
    // Agregar condiciones WHERE
    const queryParams = [];
    const conditions = [];
    
    if (category) {
      conditions.push('categoria = ?');
      queryParams.push(category);
    }
    
    if (search) {
      conditions.push('(titulo LIKE ? OR bajada LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      countQuery += whereClause;
      selectQuery += whereClause;
    }
    
    // Agregar paginación
    selectQuery += ' LIMIT ? OFFSET ?';
    
    // Obtener total de registros
    const [totalRows] = await connection.execute(countQuery, queryParams);
    
    // Obtener registros paginados
    const [rows] = await connection.execute(
      selectQuery,
      [...queryParams, limit, offset]
    );
    
    connection.release();
    
    const totalPages = Math.ceil(totalRows[0].total / limit);
    
    return NextResponse.json({
      entries: rows || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalRows[0].total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        entries: [], 
        error: 'Error al obtener las entries',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
} 