import { create } from 'zustand';

interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UsersState {
  users: UserSummary[];
  setUsers: (users: UserSummary[]) => void;
  addUser: (user: UserSummary) => void;
  updateUser: (updatedUser: UserSummary) => void;
  deleteUser: (userId: string) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (updatedUser) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    })),

  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),
}));
