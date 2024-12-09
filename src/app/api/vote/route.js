import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { entryId, vote } = await request.json();

    // Template endpoint - Replace with your actual database logic
    // Example using a hypothetical database client:
    /*
    await db.entry.update({
      where: { id: entryId },
      data: {
        ratings: {
          create: {
            vote: vote,
            userId: session.user.id // If implementing user authentication
          }
        }
      }
    });
    */

    // For now, just log the vote
    console.log(`Received vote: ${vote} for entry: ${entryId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Error al procesar el voto' },
      { status: 500 }
    );
  }
}