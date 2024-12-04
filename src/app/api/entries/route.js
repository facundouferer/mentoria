import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const offset = (page - 1) * limit;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Primero, obtener el total de registros
    let countQuery = 'SELECT COUNT(*) as total FROM entries WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND title LIKE ?';
      countParams.push(`%${search}%`);
    }

    // Consulta para obtener los registros paginados
    let query = 'SELECT * FROM entries WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Ejecutar ambas consultas
    const [totalRows] = await pool.execute(countQuery, countParams);
    const [entries] = await pool.execute(query, params);
    
    const total = totalRows[0].total;

    return NextResponse.json({
      entries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Error en la ruta API:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos' }, 
      { status: 500 }
    );
  }
} 