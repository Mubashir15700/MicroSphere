'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TaskSchema } from '@/app/lib/definitions';
import { useUsersStore } from '@/store/usersStore';
import { fetchWithAuth } from '@/lib/fetchClient';

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
  const { users } = useUsersStore();

  const [formData, setFormData] = useState<TaskFormData>(
    initialData || {
      title: '',
      description: '',
      status: 'pending',
      dueDate: '',
      assigneeId: '',
    }
  );
  const [isLoading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await fetchWithAuth('/api/user?action=getAll');

      if (response.ok) {
        const data = await response.json();
        useUsersStore.setState({ users: data });
      } else {
        console.error('Failed to fetch users');
        setError('Failed to fetch users');
      }

      setLoading(false);
    };

    if (!users.length) fetchUsers();
  }, [users]);

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
        <Select
          value={formData.status}
          onValueChange={(value: 'pending' | 'in-progress' | 'completed') =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger
            id="status"
            className="w-full rounded-md border p-2 dark:border-gray-700 dark:bg-gray-800"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="assigneeId">Assignee (optional)</Label>
        <Select
          value={formData.assigneeId || ''}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, assigneeId: value }))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {users
              .filter((user) => user.role === 'user')
              .map((user) => (
                // eslint-disable-next-line
                <SelectItem key={(user as any)._id} value={(user as any)._id}>
                  {user.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {(error || actionError) && <p className="text-red-600">{error || actionError}</p>}

      <Button type="submit" disabled={isSubmitting || isLoading}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
