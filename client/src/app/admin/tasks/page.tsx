'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Tasks, { Task } from '@/components/Tasks';
import { Button } from '@/components/ui/button';
import { useTasksStore } from '@/store/tasksStore';
import { fetchWithAuth } from '@/lib/fetchClient';

export default function UserTasksPage() {
  const tasksStore = useTasksStore();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchWithAuth('/api/task?action=getAll');
      if (!res.ok) throw new Error('Failed to fetch tasks');

      const tasksData = await res.json();

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
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string, taskName: string) => {
    if (!confirm(`Are you sure you want to delete ${taskName}?`)) return;

    try {
      setDeleting(taskId);

      const res = await fetchWithAuth(`/api/task?action=delete&id=${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to delete task');
      }

      setTasks((prev) => prev.filter((u) => u.id !== taskId));
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    if (!tasksStore.tasks.length) {
      getTasks();
    }
    {
      setTasks(tasksStore.tasks);
    }
  }, [tasksStore.tasks, tasksStore.tasks.length]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Link href="/admin/tasks/create">
          <Button>Create Task</Button>
        </Link>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <Tasks
          tasks={tasks}
          isAdmin={true}
          onDelete={(taskId: string, taskName: string) => deleteTask(taskId, taskName)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
