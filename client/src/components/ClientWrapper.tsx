'use client';

import { ReactNode } from 'react';
import { SocketProvider } from '@/contexts/SocketProvider';
import { useAuthStore } from '@/store/authStore';
import { AuthHydrator } from '@/components/AuthHydrator';

export const ClientWrapper = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <AuthHydrator />
      {user?.id ? <SocketProvider userId={user.id}>{children}</SocketProvider> : children}
    </>
  );
};
