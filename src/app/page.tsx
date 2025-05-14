import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <h1 className="text-4xl font-bold mb-6">Next.js with D1 and Authentication</h1>
          <p className="text-xl mb-8 max-w-2xl">
            A demo application showcasing Next.js with Cloudflare D1 database and Lucia authentication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4">User Management</h2>
              <p className="mb-4">Create and manage users in the Cloudflare D1 database.</p>
              <Link
                href="/users/new"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Add User
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4">Post Management</h2>
              <p className="mb-4">Create and manage posts in the Cloudflare D1 database.</p>
              <Link
                href="/posts/new"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Add Post
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <p className="mb-6">This application uses Lucia for authentication with Cloudflare D1.</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
