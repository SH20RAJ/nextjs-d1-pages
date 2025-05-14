import { drizzle } from 'drizzle-orm/d1';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

// Create a Drizzle client for D1
export function getDB() {
  const { env } = getRequestContext();
  return drizzle(env.DB, { schema });
}

// Helper function to get all users
export async function getAllUsers() {
  const db = getDB();
  // Use the D1 specific .all() method
  const result = await db.select().from(schema.users).all();
  return result;
}

// Helper function to get a user by ID
export async function getUserById(id: number) {
  const db = getDB();
  // Use the D1 specific .get() method
  const result = await db.select()
    .from(schema.users)
    .where(sql`${schema.users.id} = ${id}`)
    .get();
  return result || null;
}

// Helper function to get a user by email
export async function getUserByEmail(email: string) {
  const db = getDB();
  // Use the D1 specific .get() method
  const result = await db.select()
    .from(schema.users)
    .where(sql`${schema.users.email} = ${email}`)
    .get();
  return result || null;
}

// Helper function to create a new user
export async function createUser(user: schema.NewUser) {
  const db = getDB();
  // Use the D1 specific .run() method for insert
  await db.insert(schema.users).values(user).run();
  // Fetch the newly created user
  const newUser = await db.select()
    .from(schema.users)
    .where(sql`${schema.users.email} = ${user.email}`)
    .get();
  return newUser;
}

// Helper function to get all posts with user info
export async function getAllPosts() {
  const db = getDB();
  // Use raw SQL for the join to avoid issues with D1
  const result = await db.execute(sql`
    SELECT
      p.id,
      p.title,
      p.content,
      p.created_at,
      p.user_id,
      u.name as user_name,
      u.email as user_email
    FROM ${schema.posts} p
    JOIN ${schema.users} u ON p.user_id = u.id
    ORDER BY p.id DESC
  `).all();

  return result;
}

// Helper function to create a new post
export async function createPost(post: schema.NewPost) {
  const db = getDB();
  // Use the D1 specific .run() method for insert
  await db.insert(schema.posts).values(post).run();
  // Fetch the newly created post
  const newPost = await db.select()
    .from(schema.posts)
    .where(sql`${schema.posts.user_id} = ${post.user_id} AND ${schema.posts.title} = ${post.title}`)
    .orderBy(sql`${schema.posts.id} DESC`)
    .get();
  return newPost;
}
