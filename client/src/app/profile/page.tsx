'use client';

import { useState, useEffect } from 'react';
import ProfileForm from '@/components/Profile';

interface UserProfile {
  name: string;
  email: string;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfile({ name: 'John Doe', email: 'john@example.com' });
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      alert('Profile updated successfully!');
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
