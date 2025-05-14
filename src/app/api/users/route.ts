import { getAllUsers, createUser, getUserByEmail } from '@/db';
import { NewUser } from '@/db/schema';

export const runtime = 'edge';

interface UserRequestBody {
  name: string;
  email: string;
}

// GET all users
export async function GET() {
  try {
    const users = await getAllUsers();
    return Response.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST to create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json() as UserRequestBody;
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return Response.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Insert new user
    const newUser: NewUser = {
      name,
      email
    };

    const user = await createUser(newUser);

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
