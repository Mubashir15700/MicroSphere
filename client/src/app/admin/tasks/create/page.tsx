'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm, { TaskFormData } from '@/components/admin/TaskForm';
import { fetchWithAuth } from '@/lib/fetchClient';

export default function CreateTaskPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetchWithAuth('/api/task?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.data?.message || result?.message || 'Failed to create task');
        return;
      }

      setTimeout(() => {
        router.push('/admin/tasks');
      }, 500);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Create Task</h1>
      <TaskForm onSubmit={handleCreate} isSubmitting={isSubmitting} actionError={error} />
    </div>
  );
}
