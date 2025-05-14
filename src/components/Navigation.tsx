import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-foreground text-background p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          D1 Demo
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/users/new" className="hover:underline">
            Add User
          </Link>
          <Link href="/posts/new" className="hover:underline">
            Add Post
          </Link>
        </div>
      </div>
    </nav>
  );
}
