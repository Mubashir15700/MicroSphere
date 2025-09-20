'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
}

interface TasksProps {
  tasks: Task[];
  isAdmin?: boolean; // Optional: show extra admin actions if true
  onDelete?: (taskId: string) => void; // Admin delete handler
}

export default function Tasks({ tasks, isAdmin = false, onDelete }: TasksProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-700 dark:text-gray-300">No tasks found.</p>;
  }

  return (
    <ul className="mx-auto max-w-4xl space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between rounded-md border border-gray-300 p-4 dark:border-gray-700"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className="capitalize">{task.status}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Due: {dayjs(task.dueDate).format('MMM D, YYYY')}
            </p>
            {task.assigneeId && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Assignee ID: {task.assigneeId}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <Link href={isAdmin ? `/admin/tasks/${task.id}` : `/tasks/${task.id}`}>
              <Button size="sm" variant="outline">
                View
              </Button>
            </Link>

            {isAdmin && (
              <>
                <Link href={`/admin/tasks/${task.id}/edit`}>
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete && onDelete(task.id)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
