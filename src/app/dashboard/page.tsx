import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();
  
  // If not authenticated, redirect to sign in
  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">D1 Demo App</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/users/new"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Add User
                </Link>
                <Link
                  href="/posts/new"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Add Post
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-700">
                    {session.user?.name || session.user?.email}
                  </div>
                  <Link
                    href="/auth/signout"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
            <p className="mb-4">You are logged in as {session.user?.name || session.user?.email}</p>
            
            {session.user?.image && (
              <div className="mb-6">
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="h-20 w-20 rounded-full"
                />
              </div>
            )}
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/users/new"
                  className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium">Add New User</h4>
                  <p className="text-sm text-gray-500">Create a new user in the database</p>
                </Link>
                <Link
                  href="/posts/new"
                  className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium">Add New Post</h4>
                  <p className="text-sm text-gray-500">Create a new post in the database</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
