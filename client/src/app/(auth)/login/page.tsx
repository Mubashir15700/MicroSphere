'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { LoginFormSchema, LoginFormState } from '@/app/lib/definitions';
import { fetchWithAuth } from '@/lib/fetchClient';

export default function LoginPage() {
  const router = useRouter();
  const loginUser = useAuthStore((s) => s.login);

  const [state, setState] = useState<LoginFormState>();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const validatedFields = LoginFormSchema.safeParse({
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    });

    if (!validatedFields.success) {
      setState({
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    setState({ errors: undefined });

    setPending(true);

    try {
      const response = await fetchWithAuth('/api/auth?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedFields.data),
      });

      const data = await response.json();

      if (!response.ok) {
        setState({
          errors: {
            email: [data.message || 'Invalid login credentials'],
          },
        });
        return;
      }

      const profileResponse = await fetchWithAuth('/api/auth?action=profile', {
        method: 'GET',
      });

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        setState({
          errors: {
            email: [profileData.message || 'Failed to fetch profile data.'],
          },
        });
        return;
      }

      loginUser({
        id: profileData._id,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
      });

      const role = profileData.role;
      const route = role === 'admin' ? '/admin/dashboard' : '/dashboard';
      router.replace(route);
    } catch (error) {
      console.error('Login failed', error);
      setState({
        errors: {
          email: ['An unexpected error occurred. Please try again later.'],
        },
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Login to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            {state?.errors?.email && <p className="text-red-600">{state.errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
            {state?.errors?.password && <p className="text-red-600">{state.errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
