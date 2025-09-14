'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UserProfile {
    name: string
    email: string
}

export default function ProfilePage() {
    // Simulate fetching user data
    const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' })
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        // Replace this with your real data fetching logic
        setTimeout(() => {
            setProfile({ name: 'John Doe', email: 'john@example.com' })
            setLoading(false)
        }, 500)
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            // Replace with real API call
            await new Promise((res) => setTimeout(res, 1000))
            alert('Profile updated successfully!')
        } catch {
            setError('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="text-center mt-10">Loading profile...</p>

    return (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
            <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Your Profile</h1>

            {error && (
                <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <Input
                        id="name"
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your full name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        disabled
                        className="cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Email cannot be changed.</p>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    )
}
