'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react'; // Import the icon
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { NotificationMenu } from '@/components/NotificationMenu';
import { fetchWithAuth } from '@/lib/fetchClient';
import { useTasksStore } from '@/store/tasksStore';
import { useSocket } from '@/contexts/SocketProvider';

export default function UserDashboard() {
  const router = useRouter();
  const { logout, user } = useAuthStore((s) => s);
  const { setTasks, tasks } = useTasksStore((s) => s);
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState<
    { id: number; createdAt: string; message: string; isRead: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetchWithAuth('/api/auth?action=logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await logout();
    router.replace('/login');
  };

  // Fetch notifications once
  useEffect(() => {
    if (user?.id) {
      const fetchNotifications = async () => {
        try {
          const res = await fetchWithAuth('/api/notification?action=getAll', {
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [user?.id]);

  // Listen for real-time socket updates
  useEffect(() => {
    if (!socket) return;

    socket.on('notification:new', (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    socket.on('notification:delete', (deletedId) => {
      setNotifications((prev) => prev.filter((n) => n.id !== deletedId));
    });

    return () => {
      socket.off('notification:new');
      socket.off('notification:delete');
    };
  }, [socket]);

  const fetchData = async () => {
    if (loading || !user?.id) return;
    try {
      setLoading(true);
      setError(null);

      const tasksRes = await fetchWithAuth(`/api/task?action=getAll&assigneeId=${user?.id}`);
      if (!tasksRes.ok) throw new Error('Failed to fetch tasks');

      const tasksData = await tasksRes.json();

      setTasks(
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
        <div className="ml-5">
          <NotificationMenu notifications={notifications} />
        </div>
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
