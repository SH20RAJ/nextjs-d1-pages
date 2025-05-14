import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// GET all users
export async function GET() {
  try {
    const { env } = getRequestContext();
    const { results } = await env.DB.prepare('SELECT * FROM users ORDER BY id DESC').all();
    
    return Response.json({ users: results });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST to create a new user
export async function POST(request: Request) {
  try {
    const { env } = getRequestContext();
    const { name, email } = await request.json();
    
    // Validate input
    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }
    
    // Check if email already exists
    const { results: existingUser } = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).all();
    
    if (existingUser.length > 0) {
      return Response.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    // Insert new user
    const result = await env.DB.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?) RETURNING id, name, email, created_at'
    ).bind(name, email).all();
    
    return Response.json({ user: result.results[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
