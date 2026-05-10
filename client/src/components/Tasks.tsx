'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { ScreenMessage } from './ScreenMessage';

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
}

interface TasksProps {
  tasks: Task[];
  isAdmin?: boolean;
  currentUserId?: string;
  onDelete?: (taskId: string, userName: string) => void;
  deleting?: string | null;
}

export default function Tasks({
  tasks,
  isAdmin = false,
  currentUserId,
  onDelete,
  deleting,
}: TasksProps) {
  if (tasks.length === 0) {
    return <ScreenMessage message="No tasks found." />;
  }

  return (
    <ul className="mx-auto space-y-4">
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
            {task.assigneeId ? (
              task.assigneeId === currentUserId ? (
                <p className="text-sm text-green-600">Assigned to you</p>
              ) : (
                <p className="text-sm text-blue-600">Assigned to another user</p>
              )
            ) : (
              <p className="text-sm text-gray-500">Unassigned</p>
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
                  onClick={() => onDelete && onDelete(task.id, task.title)}
                >
                  {deleting === task.id ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
