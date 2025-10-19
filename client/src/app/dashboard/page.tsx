'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react'; // Import the icon
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const logoutUser = useAuthStore((s) => s.logout);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch('/api/auth?action=logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await logoutUser();
    router.replace('/login');
  };

  useEffect(() => {
    // Simulate fetching user tasks, replace with real API call
    setTimeout(() => {
      setTasks([
        {
          id: '1',
          title: 'Finish report',
          status: 'pending',
          dueDate: '2025-09-30',
        },
        {
          id: '2',
          title: 'Fix bug #123',
          status: 'in-progress',
          dueDate: '2025-09-20',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading your tasks...</p>;
  if (error) return <p className="mt-10 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      {/* Navigator buttons */}
      <div className="mb-6 flex justify-end">
        <Link href="/tasks">
          <Button size="sm" variant="outline">
            All Tasks
          </Button>
        </Link>
        <Link href="/profile" className="ml-5">
          <Button size="icon" variant="outline">
            <User className="h-8 w-8 text-gray-600 dark:text-gray-300" />
          </Button>
        </Link>
        <Button
          size="icon"
          variant="outline"
          className="ml-5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-8 w-8" />
        </Button>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Your Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between rounded-md border border-gray-300 p-4 dark:border-gray-700"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status: <span className="capitalize">{task.status}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <Link href={`/tasks/${task.id}`}>
                <Button size="sm">View</Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
