'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Assuming you have a user context or auth info
const currentUserId = 'user123'; // Replace with actual current logged-in user ID from your auth context

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
  const router = useRouter();
  const { taskId } = params;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Replace this with your API call to fetch task by ID
    setTimeout(() => {
      setTask({
        id: taskId! as string,
        title: 'Sample Task',
        description: 'This is a detailed description of the task.',
        status: 'pending',
        dueDate: '2025-09-30',
        assigneeId: undefined, // For testing unassigned task
      });
      setLoading(false);
    }, 700);
  }, [taskId]);

  if (loading) return <p className="mt-10 text-center">Loading task details...</p>;
  if (!task) return <p className="mt-10 text-center text-red-600">Task not found</p>;

  const handleStatusChange = async (newStatus: Task['status']) => {
    setUpdatingStatus(true);
    setError(null);
    try {
      // Replace with your API call to update status
      await new Promise((res) => setTimeout(res, 800));
      setTask({ ...task, status: newStatus });
    } catch {
      setError('Failed to update status');
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
      setTask({ ...task, assigneeId: currentUserId });
    } catch {
      setError('Failed to request assignment');
    } finally {
      setAssigning(false);
    }
  };

  const isAssignedToCurrentUser = task.assigneeId === currentUserId;

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
          <strong>Assignee ID:</strong> {task.assigneeId}
        </p>
      ) : (
        <p className="mb-6 text-gray-600 italic dark:text-gray-400">No assignee yet</p>
      )}

      <div className="mb-4 space-x-2">
        <Button
          onClick={() => handleStatusChange('pending')}
          disabled={updatingStatus || task.status === 'pending' || !isAssignedToCurrentUser}
          variant={task.status === 'pending' ? 'default' : 'outline'}
          size="sm"
        >
          Pending
        </Button>
        <Button
          onClick={() => handleStatusChange('in-progress')}
          disabled={updatingStatus || task.status === 'in-progress' || !isAssignedToCurrentUser}
          variant={task.status === 'in-progress' ? 'default' : 'outline'}
          size="sm"
        >
          In Progress
        </Button>
        <Button
          onClick={() => handleStatusChange('completed')}
          disabled={updatingStatus || task.status === 'completed' || !isAssignedToCurrentUser}
          variant={task.status === 'completed' ? 'default' : 'outline'}
          size="sm"
        >
          Completed
        </Button>
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
