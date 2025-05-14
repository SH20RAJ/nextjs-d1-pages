import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// GET all posts with user info
export async function GET() {
  try {
    const { env } = getRequestContext();
    const { results } = await env.DB.prepare(`
      SELECT 
        posts.id, 
        posts.title, 
        posts.content, 
        posts.created_at, 
        posts.user_id,
        users.name as user_name, 
        users.email as user_email
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.id DESC
    `).all();
    
    return Response.json({ posts: results });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST to create a new post
export async function POST(request: Request) {
  try {
    const { env } = getRequestContext();
    const { user_id, title, content } = await request.json();
    
    // Validate input
    if (!user_id || !title || !content) {
      return Response.json({ error: 'User ID, title, and content are required' }, { status: 400 });
    }
    
    // Check if user exists
    const { results: existingUser } = await env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(user_id).all();
    
    if (existingUser.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Insert new post
    const result = await env.DB.prepare(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?) RETURNING id, user_id, title, content, created_at'
    ).bind(user_id, title, content).all();
    
    return Response.json({ post: result.results[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
