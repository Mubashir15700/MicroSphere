'use client';

import { useRouter } from 'next/navigation';
import TaskForm, { TaskFormData } from '@/components/admin/TaskForm';

export default function CreateTaskPage() {
  const router = useRouter();

  const handleCreate = async (data: TaskFormData) => {
    // TODO: Send POST request to create task
    console.log('Creating task:', data);

    // Simulate success
    setTimeout(() => {
      router.push('/admin/tasks');
    }, 500);
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Create Task</h1>
      <TaskForm onSubmit={handleCreate} />
    </div>
  );
}
