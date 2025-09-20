'use client';

import Tasks, { Task } from '@/components/Tasks';
import { useState } from 'react';

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Finish report',
      status: 'pending',
      dueDate: '2025-09-30',
      assigneeId: 'user1',
    },
    {
      id: '2',
      title: 'Fix bug #123',
      status: 'in-progress',
      dueDate: '2025-09-20',
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Tasks</h1>
      <Tasks tasks={tasks} />
    </div>
  );
}
