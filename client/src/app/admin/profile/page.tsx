'use client';

import { useState, useEffect } from 'react';
import ProfileForm from '@/components/Profile';
import { useAuthStore } from '@/store/authStore';
import { ProfileSchema } from '@/app/lib/definitions';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function AdminProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    role: 'admin',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfile({
        id: user?.id || '',
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'admin',
      });
      setLoading(false);
    }, 500);
  }, [user]);

  const handleSave = async () => {
    setError(null);
    const validated = ProfileSchema.safeParse({ name: profile.name });
    if (!validated.success) {
      setError(validated.error.issues.map((issue) => issue.message).join(', '));
      return;
    }
    setError(null);
    try {
      setSaving(true);

      const response = await fetch('/api/auth?action=profile&id=' + user!.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: profile.name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      updateUser({ name: profile.name });
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileForm
      profile={profile}
      onProfileChange={setProfile}
      onSave={handleSave}
      loading={loading}
      saving={saving}
      error={error}
    />
  );
}
