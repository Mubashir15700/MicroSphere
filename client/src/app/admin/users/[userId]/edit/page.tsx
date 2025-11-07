'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserForm, { UserFormData } from '@/components/admin/UserForm';
import { fetchWithAuth } from '@/lib/fetchClient';
import { useUsersStore } from '@/store/usersStore';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  const { users, updateUser } = useUsersStore();

  const [user, setUser] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!params?.userId) return;
    const user = users.find((u) => u.id === params?.userId);

    if (user) {
      setUser({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setLoading(false);
      return;
    } else {
      fetchWithAuth(`/api/user?action=getById&id=${params.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params?.userId, users]);

  const handleUpdate = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
      };

      const response = await fetchWithAuth(`/api/user?action=update&id=${params?.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.data?.message || result?.message || 'Failed to update user');
        return;
      }

      if (result.user) {
        updateUser(result.user);
      }

      setTimeout(() => {
        router.push('/admin/users');
      }, 500);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading user...</p>;
  if (!user) return <p className="mt-10 text-center text-red-600">User not found.</p>;

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Edit User</h1>

      <UserForm
        initialData={user}
        onSubmit={handleUpdate}
        actionError={error}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
