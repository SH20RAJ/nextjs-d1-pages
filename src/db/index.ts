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
  const { env } = getRequestContext();
  const result = await env.DB.prepare(`
    SELECT * FROM users ORDER BY id DESC
  `).all();
  return result.results;
}

// Helper function to get a user by ID
export async function getUserById(id: number) {
  const { env } = getRequestContext();
  const result = await env.DB.prepare(`
    SELECT * FROM users WHERE id = ?
  `).bind(id).first();
  return result || null;
}

// Helper function to get a user by email
export async function getUserByEmail(email: string) {
  const { env } = getRequestContext();
  const result = await env.DB.prepare(`
    SELECT * FROM users WHERE email = ?
  `).bind(email).first();
  return result || null;
}

// Helper function to create a new user
export async function createUser(user: schema.NewUser) {
  const { env } = getRequestContext();
  // Insert the new user
  await env.DB.prepare(`
    INSERT INTO users (name, email) VALUES (?, ?)
  `).bind(user.name, user.email).run();

  // Fetch the newly created user
  const newUser = await env.DB.prepare(`
    SELECT * FROM users WHERE email = ?
  `).bind(user.email).first();

  return newUser;
}

// Helper function to get all posts with user info
export async function getAllPosts() {
  const db = getDB();
  // Use the D1 specific .all() method with a prepared statement
  const { env } = getRequestContext();
  const result = await env.DB.prepare(`
    SELECT
      p.id,
      p.title,
      p.content,
      p.created_at,
      p.user_id,
      u.name as user_name,
      u.email as user_email
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.id DESC
  `).all();

  return result.results;
}

// Helper function to create a new post
export async function createPost(post: schema.NewPost) {
  const { env } = getRequestContext();
  // Insert the new post
  await env.DB.prepare(`
    INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)
  `).bind(post.user_id, post.title, post.content).run();

  // Fetch the newly created post
  const newPost = await env.DB.prepare(`
    SELECT * FROM posts
    WHERE user_id = ? AND title = ?
    ORDER BY id DESC LIMIT 1
  `).bind(post.user_id, post.title).first();

  return newPost;
}
