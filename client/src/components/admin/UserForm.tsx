'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export interface UserFormData {
    name: string
    email: string
    password?: string
    role: 'admin' | 'user'
}

interface UserFormProps {
    initialData?: UserFormData
    onSubmit?: (data: UserFormData) => void
    isSubmitting?: boolean
    isViewOnly?: boolean
}

export default function UserForm({
    initialData,
    onSubmit,
    isSubmitting = false,
    isViewOnly = false,
}: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>(
        initialData || {
            name: '',
            email: '',
            password: '',
            role: 'user',
        }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSubmit) onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isViewOnly}
                />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isViewOnly}
                />
            </div>

            {!isViewOnly && (
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        required={!initialData} // required only for new user
                    />
                </div>
            )}

            <div>
                <Label htmlFor="role">Role</Label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {!isViewOnly && (
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            )}
        </form>
    )
}
