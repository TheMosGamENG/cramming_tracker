import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const tasks = await prisma.task.findMany({
    where: { userId: userId as string }
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const task = await prisma.task.create({
    data: {
      title: body.title,
      subject: body.subject,
      dueDate: body.dueDate,
      dueTime: body.dueTime,
      userId: body.userId,
    }
  });
  return NextResponse.json(task);
}