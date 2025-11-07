'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TaskForm, { TaskFormData } from '@/components/admin/TaskForm';
import { fetchWithAuth } from '@/lib/fetchClient';
import { useTasksStore } from '@/store/tasksStore';

interface PageProps {
  params: { taskId: string };
}

export default function EditTaskPage({ params }: PageProps) {
  const { taskId } = params;
  const router = useRouter();

  const { tasks, updateTask } = useTasksStore();

  const [task, setTask] = useState<TaskFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // if (taskId) return;
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      setTask({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        id: task._id,
        assigneeId: task.assigneeId,
      });
      setLoading(false);
      return;
    } else {
      fetchWithAuth(`/api/task?action=getById&id=${taskId}`)
        .then((res) => res.json())
        .then((data) => {
          setTask(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [taskId, tasks]);

  const handleUpdate = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status,
        ...(data.assigneeId && { assigneeId: data.assigneeId }),
      };

      const response = await fetchWithAuth(`/api/task?action=update&id=${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.data?.message || result?.message || 'Failed to update task');
        return;
      }

      if (result.task) {
        updateTask(result.task);
      }

      setTimeout(() => {
        router.push('/admin/tasks');
      }, 500);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading task...</p>;
  if (!task) return <p className="mt-10 text-center">Task not found.</p>;

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h1>
      <TaskForm
        initialData={task}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        actionError={error}
      />
    </div>
  );
}
