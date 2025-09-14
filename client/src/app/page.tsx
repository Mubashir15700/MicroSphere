'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Task Management Made Simple
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Stay organized and in control. Whether you&apos;re an admin assigning work or a user managing your tasks — everything you need in one place.
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
  )
}
