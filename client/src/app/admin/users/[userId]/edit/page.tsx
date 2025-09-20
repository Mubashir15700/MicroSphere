'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserForm, { UserFormData } from '@/components/admin/UserForm';

export default function EditUserPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user data from API using userId
    setTimeout(() => {
      setUser({
        name: 'Bob Admin',
        email: 'bob@example.com',
        role: 'admin',
      });
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleUpdate = async (data: UserFormData) => {
    // TODO: Send PUT/PATCH request to API
    console.log('Updating user:', data);

    // Simulate API success
    setTimeout(() => {
      router.push(`/admin/users/${userId}`);
    }, 500);
  };

  if (loading) return <p className="mt-10 text-center">Loading user...</p>;
  if (!user) return <p className="mt-10 text-center text-red-600">User not found.</p>;

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Edit User</h1>

      <UserForm initialData={user} onSubmit={handleUpdate} />
    </div>
  );
}
