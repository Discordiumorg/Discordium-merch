'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext, type AuthUser } from '@/lib/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'Login failed' };
    setUser(data.user);
    return {};
  }, []);

  const register = useCallback(async (form: { email: string; password: string; name: string; age: string; gender: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'Registration failed' };
    setUser(data.user);
    return {};
  }, []);

  const demoLogin = useCallback(async () => {
    const res = await fetch('/api/auth/demo', { method: 'POST' });
    const data = await res.json();
    if (data.user) setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
