'use client';

import { createContext, useContext } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  bio?: string;
  location?: string;
  photoUrl?: string;
  coins: number;
  diamonds: number;
  boosts: number;
  superLikes: number;
  roses: number;
  premium: boolean;
  premiumTier?: string;
  verified: boolean;
  isAdmin?: boolean;
  isMod?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: { email: string; password: string; name: string; age: string; gender: string }) => Promise<{ error?: string }>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  demoLogin: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
