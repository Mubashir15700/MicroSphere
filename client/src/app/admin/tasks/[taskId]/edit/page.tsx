'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TaskForm, { TaskFormData } from '@/components/admin/TaskForm';

interface PageProps {
  params: { taskId: string };
}

export default function EditTaskPage({ params }: PageProps) {
  const { taskId } = params;
  const router = useRouter();
  const [task, setTask] = useState<TaskFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch task details by taskId
    setTimeout(() => {
      setTask({
        title: 'Sample Task',
        description: 'This is an editable task.',
        status: 'pending',
        dueDate: '2025-09-30',
        assigneeId: 'user123',
      });
      setLoading(false);
    }, 500);
  }, [taskId]);

  const handleUpdate = async (data: TaskFormData) => {
    // TODO: Send PUT/PATCH request to update task
    console.log('Updating task:', data);

    setTimeout(() => {
      router.push(`/admin/tasks/${taskId}`);
    }, 500);
  };

  if (loading) return <p className="mt-10 text-center">Loading task...</p>;
  if (!task) return <p className="mt-10 text-center">Task not found.</p>;

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h1>
      <TaskForm initialData={task} onSubmit={handleUpdate} />
    </div>
  );
}
