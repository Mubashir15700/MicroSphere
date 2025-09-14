'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TaskForm, { TaskFormData } from '@/components/admin/TaskForm'

interface PageProps {
    params: { taskId: string }
}

export default function EditTaskPage({ params }: PageProps) {
    const { taskId } = params
    const router = useRouter()
    const [task, setTask] = useState<TaskFormData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: Fetch task details by taskId
        setTimeout(() => {
            setTask({
                title: 'Sample Task',
                description: 'This is an editable task.',
                status: 'pending',
                dueDate: '2025-09-30',
                assigneeId: 'user123',
            })
            setLoading(false)
        }, 500)
    }, [taskId])

    const handleUpdate = async (data: TaskFormData) => {
        // TODO: Send PUT/PATCH request to update task
        console.log('Updating task:', data)

        setTimeout(() => {
            router.push(`/admin/tasks/${taskId}`)
        }, 500)
    }

    if (loading) return <p className="text-center mt-10">Loading task...</p>
    if (!task) return <p className="text-center mt-10">Task not found.</p>

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Task</h1>
            <TaskForm initialData={task} onSubmit={handleUpdate} />
        </div>
    )
}
