'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TaskSchema } from '@/app/lib/definitions';

export interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
}

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  isSubmitting?: boolean;
  actionError?: string | null;
}

export default function TaskForm({
  initialData,
  onSubmit,
  isSubmitting,
  actionError,
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(
    initialData || {
      title: '',
      description: '',
      status: 'pending',
      dueDate: '',
      assigneeId: '',
    }
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validatedFields = TaskSchema.safeParse({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      dueDate: formData.dueDate,
      assigneeId: formData.assigneeId,
    });

    if (!validatedFields.success) {
      setError(validatedFields.error.issues.map((issue) => issue.message).join(', '));
      return;
    }

    setError(null);

    if (onSubmit) onSubmit(formData);
  };

  const dueDate = formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-md border p-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="assigneeId">Assignee ID (optional)</Label>
        <Input
          id="assigneeId"
          name="assigneeId"
          value={formData.assigneeId}
          onChange={handleChange}
        />
      </div>

      {(error || actionError) && <p className="text-red-600">{error || actionError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
