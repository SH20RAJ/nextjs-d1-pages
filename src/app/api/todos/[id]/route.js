import { NextResponse } from 'next/server';
import { getPrismaClient } from '../../../../lib/prisma';

// GET /api/todos/[id] - Get a specific todo
export async function GET(_, context) {
  try {
    // Make sure to await params before using its properties
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error(`Error fetching todo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

// PATCH /api/todos/[id] - Update a todo
export async function PATCH(request, context) {
  try {
    // Make sure to await params before using its properties
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const prisma = getPrismaClient();

    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Update the todo
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        completed: data.completed !== undefined ? data.completed : undefined,
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error(`Error updating todo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(_, context) {
  try {
    // Make sure to await params before using its properties
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();

    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Delete the todo
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting todo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
