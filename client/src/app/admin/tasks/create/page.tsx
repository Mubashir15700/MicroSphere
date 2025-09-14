'use client'

import { useRouter } from 'next/navigation'
import TaskForm, { TaskFormData } from '@/components/admin/TaskForm'

export default function CreateTaskPage() {
    const router = useRouter()

    const handleCreate = async (data: TaskFormData) => {
        // TODO: Send POST request to create task
        console.log('Creating task:', data)

        // Simulate success
        setTimeout(() => {
            router.push('/admin/tasks')
        }, 500)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create Task</h1>
            <TaskForm onSubmit={handleCreate} />
        </div>
    )
}
