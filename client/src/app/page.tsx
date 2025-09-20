'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-gray-900">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
          Task Management Made Simple
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Stay organized and in control. Whether you&apos;re an admin assigning work or a user
          managing your tasks — everything you need in one place.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      </div>

      <footer className="mt-20 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} SM15700. All rights reserved.
      </footer>
    </main>
  );
}
