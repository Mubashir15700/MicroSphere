'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with real API call to fetch users
    setTimeout(() => {
      setUsers([
        { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', role: 'user' },
        { id: 'u2', name: 'Bob Admin', email: 'bob@example.com', role: 'admin' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading users...</p>;
  if (error) return <p className="mt-10 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Users</h1>
        <Link href="/admin/users/create">
          <Button>Create User</Button>
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No users found.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between py-4">
              <div>
                <Link href={`/admin/users/${user.id}`}>
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                    {user.name}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize dark:text-gray-500">
                  Role: {user.role}
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/users/${user.id}/edit`}>
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => alert(`Delete user ${user.name}`)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
