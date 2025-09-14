'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import UserForm, { UserFormData } from '@/components/admin/UserForm'

export default function AdminUserDetailPage() {
    const { userId } = useParams()
    const [user, setUser] = useState<UserFormData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: Replace this with an API call to fetch user by ID
        setTimeout(() => {
            setUser({
                name: 'Bob Admin',
                email: 'bob@example.com',
                role: 'admin',
            })
            setLoading(false)
        }, 500)
    }, [userId])

    if (loading) {
        return <p className="text-center mt-10">Loading user details...</p>
    }

    if (!user) {
        return <p className="text-center mt-10 text-red-600">User not found.</p>
    }

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Details</h1>

            <UserForm initialData={user} isViewOnly />
        </div>
    )
}
