import Navigation from "@/components/Navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <h1 className="text-4xl font-bold mb-6">Next.js with D1 and Auth.js</h1>
          <p className="text-xl mb-8 max-w-2xl">
            A demo application showcasing Next.js with Cloudflare D1 database and Auth.js authentication.
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
            <p className="mb-6">This application uses Auth.js for authentication with Google and GitHub providers.</p>

            {session ? (
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-24 w-24 rounded-full mb-4"
                    />
                  )}
                  <p className="text-lg">
                    Signed in as <strong>{session.user?.name || session.user?.email}</strong>
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/signin"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
