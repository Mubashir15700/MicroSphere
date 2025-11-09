'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTasksStore } from '@/store/tasksStore';
import { fetchWithAuth } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/authStore';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
}

export default function TaskDetailsPage() {
  const params = useParams();

  const { tasks, updateTask } = useTasksStore();
  const { user } = useAuthStore((s) => s);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className="mt-10 text-center">Loading task details...</p>;
  if (!task) return <p className="mt-10 text-center text-red-600">Task not found</p>;

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      setUpdatingStatus(true);
      setError(null);

      const payload = {
        status: newStatus,
      };

      const response = await fetchWithAuth(`/api/task?action=update&id=${params?.taskId}`, {
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
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRequestAssign = async () => {
    setAssigning(true);
    setError(null);
    try {
      // Replace with your API call to request assignment
      // For demo, we just assign currentUserId immediately
      await new Promise((res) => setTimeout(res, 800));
      setTask({ ...task, assigneeId: user?.id });
    } catch {
      setError('Failed to request assignment');
    } finally {
      setAssigning(false);
    }
  };

  const isAssignedToCurrentUser = task.assigneeId === user?.id;

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{task.description}</p>

      <p className="mb-1 text-gray-600 dark:text-gray-400">
        <strong>Status:</strong> <span className="capitalize">{task.status}</span>
      </p>

      <p className="mb-4 text-gray-600 dark:text-gray-400">
        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
      </p>

      {task.assigneeId ? (
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          <strong>Assignee:</strong>{' '}
          {task.assigneeId === user?.id ? user?.name + '(You)' : task.assigneeId}
        </p>
      ) : (
        <p className="mb-6 text-gray-600 italic dark:text-gray-400">No assignee yet</p>
      )}

      <div className="mb-4 space-x-2">
        {['pending', 'in-progress', 'completed'].map((status) => (
          <Button
            key={status}
            onClick={() => handleStatusChange(status as Task['status'])}
            disabled={updatingStatus || task.status === status || !isAssignedToCurrentUser}
            variant={task.status === status ? 'default' : 'outline'}
            size="sm"
          >
            {status.toLocaleUpperCase()}
          </Button>
        ))}
      </div>

      {/* Show request assignment button only if task has no assignee */}
      {!task.assigneeId && (
        <Button
          onClick={handleRequestAssign}
          disabled={assigning}
          variant="secondary"
          size="sm"
          className="mb-4"
        >
          {assigning ? 'Requesting...' : 'Request Assignment'}
        </Button>
      )}

      {error && <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
