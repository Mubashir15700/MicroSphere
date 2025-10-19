import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user) => set({ user, isAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false }),

  updateUser: (userUpdates) =>
    set((state) => ({
      user: { ...state.user, ...userUpdates } as User,
    })),

  hydrate: async () => {
    try {
      const res = await fetch('/api/auth?action=profile');
      if (res.ok) {
        const { _id, name, email, role } = await res.json();
        set({ user: { id: _id, name, email, role }, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      console.error('Hydration failed', err);
      set({ user: null, isAuthenticated: false });
    }
  },
}));
