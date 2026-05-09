import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    // Standard SQL Query
    const result = await query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title, subject, dueDate, userId } = await request.json();

  try {
    const result = await query(
      'INSERT INTO tasks (title, subject, due_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, subject, dueDate, userId]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}