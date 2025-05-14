import Navigation from "@/components/Navigation";
import Link from "next/link";
import { getAllUsers, getAllPosts } from "@/db";

// Set edge runtime for Cloudflare Pages
export const runtime = 'edge';

// Server component that directly uses Drizzle ORM
export default async function Home() {
  let users = [];
  let posts = [];

  try {
    // Fetch users and posts using Drizzle ORM
    users = await getAllUsers();
    posts = await getAllPosts();
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">D1 Database with Drizzle ORM</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Users Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Users</h2>
              <Link
                href="/users/new"
                className="bg-foreground text-background px-4 py-2 rounded hover:opacity-90"
              >
                Add User
              </Link>
            </div>

            {users.length > 0 ? (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border p-4 rounded">
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-sm">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No users found. Add your first user!</p>
            )}
          </div>

          {/* Posts Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Posts</h2>
              <Link
                href="/posts/new"
                className="bg-foreground text-background px-4 py-2 rounded hover:opacity-90"
              >
                Add Post
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border p-4 rounded">
                    <h3 className="font-bold">{post.title}</h3>
                    <p className="text-sm mt-2">{post.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      By: {post.user_name} ({post.user_email})
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts found. Add your first post!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
