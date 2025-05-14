import { getAllPosts, createPost, getUserById } from '@/db';
import { NewPost } from '@/db/schema';

export const runtime = 'edge';

interface PostRequestBody {
  user_id: number;
  title: string;
  content: string;
}

// GET all posts with user info
export async function GET() {
  try {
    const posts = await getAllPosts();
    return Response.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST to create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json() as PostRequestBody;
    const { user_id, title, content } = body;

    // Validate input
    if (!user_id || !title || !content) {
      return Response.json({ error: 'User ID, title, and content are required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await getUserById(user_id);

    if (!existingUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Insert new post
    const newPost: NewPost = {
      user_id,
      title,
      content
    };

    const post = await createPost(newPost);

    return Response.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
