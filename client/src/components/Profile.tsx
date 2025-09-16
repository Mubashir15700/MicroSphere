'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserProfile {
    name: string;
    email: string;
}

interface ProfileFormProps {
    profile: UserProfile;
    onProfileChange: (updatedProfile: UserProfile) => void;
    onSave: () => void;
    saving: boolean;
    loading: boolean;
    error?: string | null;
}

export default function ProfileForm({
    profile,
    onProfileChange,
    onSave,
    saving,
    loading,
    error = null,
}: ProfileFormProps) {
    if (loading) return <p className="mt-10 text-center">Loading profile...</p>;

    return (
        <div className="mx-auto mt-10 max-w-md rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
            <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Profile</h1>

            {error && <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <Input
                        id="name"
                        type="text"
                        value={profile.name}
                        onChange={(e) => onProfileChange({ ...profile, name: e.target.value })}
                        placeholder="Your full name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        placeholder="you@example.com"
                        disabled
                        className="cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Email cannot be changed.</p>
                </div>

                <Button onClick={onSave} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
