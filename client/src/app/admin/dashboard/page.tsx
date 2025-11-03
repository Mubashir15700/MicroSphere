'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUsersStore } from '@/store/usersStore';
import { useTasksStore } from '@/store/tasksStore';
import { fetchWithAuth } from '@/lib/fetchClient';

export default function AdminDashboard() {
  const usersStore = useUsersStore();
  const tasksStore = useTasksStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);

      const [usersRes, tasksRes] = await Promise.all([
        fetchWithAuth('/api/user?action=getAll'),
        fetchWithAuth('/api/task?action=getAll'),
      ]);

      if (!usersRes.ok) throw new Error('Failed to fetch users');
      if (!tasksRes.ok) throw new Error('Failed to fetch tasks');

      const usersData = await usersRes.json();
      const tasksData = await tasksRes.json();

      usersStore.setUsers(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        usersData.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
        }))
      );
      tasksStore.setTasks(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tasksData.map((task: any) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
        }))
      );
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading dashboard...</p>;
  if (error) return <p className="mt-10 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-10 rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

      {/* Summary Section */}
      <div className="flex justify-around rounded-md bg-gray-100 p-6 text-center dark:bg-gray-700">
        <div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {usersStore.users.length}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Users</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {tasksStore.tasks.length}
          </p>
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
        {usersStore.users.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No users found.</p>
        ) : (
          <ul className="space-y-3">
            {usersStore.users.map((user) => (
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
        {tasksStore.tasks.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {tasksStore.tasks.map((task) => (
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
