import { drizzle } from 'drizzle-orm/d1';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { desc, sql } from 'drizzle-orm';
import * as schema from './schema';

// Create a Drizzle client for D1
export function getDB() {
  const { env } = getRequestContext();
  return drizzle(env.DB, { schema });
}

// Helper function to get all users
export async function getAllUsers() {
  const db = getDB();
  return await db.select().from(schema.users).orderBy(desc(schema.users.id));
}

// Helper function to get a user by ID
export async function getUserById(id: number) {
  const db = getDB();
  const results = await db.select().from(schema.users).where(schema.users.id.eq(id));
  return results[0] || null;
}

// Helper function to get a user by email
export async function getUserByEmail(email: string) {
  const db = getDB();
  const results = await db.select().from(schema.users).where(schema.users.email.eq(email));
  return results[0] || null;
}

// Helper function to create a new user
export async function createUser(user: schema.NewUser) {
  const db = getDB();
  const result = await db.insert(schema.users).values(user).returning();
  return result[0];
}

// Helper function to get all posts with user info
export async function getAllPosts() {
  const db = getDB();
  return await db.select({
    id: schema.posts.id,
    title: schema.posts.title,
    content: schema.posts.content,
    created_at: schema.posts.created_at,
    user_id: schema.posts.user_id,
    user_name: schema.users.name,
    user_email: schema.users.email,
  })
  .from(schema.posts)
  .innerJoin(
    schema.users,
    // Use the SQL equality operator directly
    sql`${schema.posts.user_id} = ${schema.users.id}`
  )
  .orderBy(desc(schema.posts.id));
}

// Helper function to create a new post
export async function createPost(post: schema.NewPost) {
  const db = getDB();
  const result = await db.insert(schema.posts).values(post).returning();
  return result[0];
}
