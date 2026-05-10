'use client';

import { ScreenMessage } from '@/components/ScreenMessage';
import Tasks from '@/components/Tasks';
import { fetchWithAuth } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/authStore';
import { useTasksStore } from '@/store/tasksStore';
import { useEffect, useState } from 'react';

export default function UserTasksPage() {
  const { setTasks, tasks } = useTasksStore((s) => s);
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);

      const tasksRes = await fetchWithAuth('/api/task?action=getAll');
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
          assigneeId: task.assigneeId,
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

  if (loading) {
    return <ScreenMessage message="Loading all tasks..." />;
  }

  if (error) {
    return <ScreenMessage message={error} type="error" />;
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-4 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto flex h-full w-full p-6 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6 dark:border-gray-700">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tasks
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Browse and manage all available tasks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {tasks.length} Tasks
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {tasks.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                No Tasks Yet
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                There are currently no tasks to display.
              </p>
            </div>
          ) : (
            <div className="gap-5">
              <Tasks tasks={tasks} currentUserId={user?.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
