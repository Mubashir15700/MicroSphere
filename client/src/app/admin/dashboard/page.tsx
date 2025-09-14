'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Replace with real API calls
    setTimeout(() => {
      setUsers([
        { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com' },
        { id: 'u2', name: 'Bob Smith', email: 'bob@example.com' },
      ]);
      setTasks([
        {
          id: 't1',
          title: 'Prepare presentation',
          status: 'in-progress',
          dueDate: '2025-09-25',
          assigneeId: 'u1',
        },
        {
          id: 't2',
          title: 'Update documentation',
          status: 'pending',
          dueDate: '2025-09-28',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading dashboard...</p>;
  if (error) return <p className="mt-10 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-10 rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

      {/* Summary Section */}
      <div className="flex justify-around rounded-md bg-gray-100 p-6 text-center dark:bg-gray-700">
        <div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{users.length}</p>
          <p className="text-gray-700 dark:text-gray-300">Users</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{tasks.length}</p>
          <p className="text-gray-700 dark:text-gray-300">Tasks</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Link href="/admin/users/create">
          <Button>Create User</Button>
        </Link>
        <Link href="/admin/tasks/create">
          <Button>Create Task</Button>
        </Link>
      </div>

      {/* Users List */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No users found.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between rounded-md border border-gray-300 p-3 dark:border-gray-700"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <Link href={`/admin/users/${user.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tasks List */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-md border border-gray-300 p-3 dark:border-gray-700"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{task.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: <span className="capitalize">{task.status}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/admin/tasks/${task.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
