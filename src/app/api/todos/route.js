import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Helper function to initialize Prisma with D1
function getPrismaClient() {
  const { env } = getCloudflareContext();
  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
}

// GET /api/todos - Get all todos
export async function GET() {
  try {
    const prisma = getPrismaClient();
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request) {
  try {
    const { title } = await request.json();
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const prisma = getPrismaClient();
    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        completed: false,
      },
    });
    
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
