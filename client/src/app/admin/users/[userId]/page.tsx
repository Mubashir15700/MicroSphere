'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUsersStore } from '@/store/usersStore';
import UserForm, { UserFormData } from '@/components/admin/UserForm';
import { fetchWithAuth } from '@/lib/fetchClient';

export default function AdminUserDetailPage() {
  const params = useParams();

  const { users } = useUsersStore();

  const [user, setUser] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="mt-10 text-center">Loading user details...</p>;
  }

  if (!user) {
    return <p className="mt-10 text-center text-red-600">User not found.</p>;
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">User Details</h1>

      <UserForm initialData={user} isViewOnly />
    </div>
  );
}
