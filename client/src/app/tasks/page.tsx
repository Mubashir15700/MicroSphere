'use client';

import Tasks from '@/components/Tasks';
import { fetchWithAuth } from '@/lib/fetchClient';
import { useTasksStore } from '@/store/tasksStore';
import { useEffect, useState } from 'react';

export default function UserTasksPage() {
  const { setTasks, tasks } = useTasksStore((s) => s);

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
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Tasks</h1>
      <Tasks tasks={tasks} />
    </div>
  );
}
