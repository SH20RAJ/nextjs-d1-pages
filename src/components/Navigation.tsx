'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <nav className="bg-foreground text-background p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          D1 Demo with Auth.js
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/users/new" className="hover:underline">
                Add User
              </Link>
              <Link href="/posts/new" className="hover:underline">
                Add Post
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Sign Out'}
              </button>

              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-8 w-8 rounded-full inline-block ml-2"
                />
              )}
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:underline">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
