'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/fetchClient';
import { useTasksStore } from '@/store/tasksStore';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
}

export default function AdminTaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { tasks } = useTasksStore();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.taskId) return;
    const task = tasks.find((t) => t.id === params?.taskId);

    if (task) {
      setTask({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        id: task.id,
        assigneeId: task.assigneeId,
      });
      setLoading(false);
      return;
    } else {
      fetchWithAuth(`/api/task?action=getById&id=${params.taskId}`)
        .then((res) => res.json())
        .then((data) => {
          setTask(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params?.taskId, tasks]);

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    // TODO: Delete task API call here
    alert('Task deleted!');

    // Redirect back to admin tasks list after delete
    router.push('/admin/tasks');
  };

  if (loading) return <p className="mt-10 text-center">Loading task details...</p>;
  if (!task) return <p className="mt-10 text-center">Task not found.</p>;

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{task.title}</h1>

      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Description: </strong>
        {task.description}
      </p>

      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Status: </strong>
        <span className="capitalize">{task.status}</span>
      </p>

      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>Due Date: </strong>
        {new Date(task.dueDate).toLocaleDateString()}
      </p>

      {task.assigneeId && (
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          <strong>Assignee ID: </strong>
          {task.assigneeId}
        </p>
      )}

      <div className="flex space-x-4">
        <Link href={`/admin/tasks/${task.id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
        <Link href="/admin/tasks">
          <Button variant="outline">Back to Tasks</Button>
        </Link>
      </div>
    </div>
  );
}
