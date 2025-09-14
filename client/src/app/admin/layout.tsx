'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navLinks = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/tasks', label: 'Tasks' },
    ]

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 font-bold text-lg text-gray-900 dark:text-white">
                    Admin Panel
                </div>

                <nav className="flex flex-col mt-4 space-y-1 px-2">
                    {navLinks.map(({ href, label }) => {
                        const isActive = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`block rounded-md px-3 py-2 text-sm font-medium ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {label}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin</h1>
                    {/* TODO: Add user profile, logout button, etc */}
                </header>

                {/* Content area */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    )
}
