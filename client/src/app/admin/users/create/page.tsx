'use client'

import { useRouter } from 'next/navigation'
import UserForm, { UserFormData } from '@/components/admin/UserForm'

export default function CreateUserPage() {
    const router = useRouter()

    const handleCreate = async (data: UserFormData) => {
        // TODO: Send POST request to API to create user
        console.log('Creating user:', data)

        // Simulate API success
        setTimeout(() => {
            router.push('/admin/users')
        }, 500)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New User</h1>

            <UserForm onSubmit={handleCreate} />
        </div>
    )
}
