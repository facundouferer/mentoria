import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = 'SELECT * FROM entries WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM entries WHERE 1=1';
    const params = [];
    const countParams = [];

    if (category) {
      query += ' AND categoria = ?';
      countQuery += ' AND categoria = ?';
      params.push(category);
      countParams.push(category);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      query += ' AND (titulo LIKE ? OR bajada LIKE ? OR desarrollo LIKE ?)';
      countQuery += ' AND (titulo LIKE ? OR bajada LIKE ? OR desarrollo LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [totalRows] = await pool.execute(countQuery, countParams);
    const [entries] = await pool.execute(query, params);

    return NextResponse.json({
      entries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRows[0].total / limit),
        totalItems: totalRows[0].total
      },
      debug: {
        query,
        params,
        category,
        searchTerm: search
      }
    });

  } catch (error) {
    console.error('Error completo:', error);
    return NextResponse.json(
      { 
        error: 'Error en la consulta de la base de datos',
        details: error.message,
        fullError: error.toString(),
        debug: {
          query: error.query,
          params: error.params
        }
      },
      { status: 500 }
    );
  }
} 