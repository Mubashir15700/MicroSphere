'use client';

import { useRouter } from 'next/navigation';
import UserForm, { UserFormData } from '@/components/admin/UserForm';

export default function CreateUserPage() {
  const router = useRouter();

  const handleCreate = async (data: UserFormData) => {
    // TODO: Send POST request to API to create user
    console.log('Creating user:', data);

    // Simulate API success
    setTimeout(() => {
      router.push('/admin/users');
    }, 500);
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Create New User</h1>

      <UserForm onSubmit={handleCreate} />
    </div>
  );
}
