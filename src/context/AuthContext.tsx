import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BusinessMember, Business } from '../../shared/types.ts';
import { api } from '../services/apiClient.ts';

interface AuthSession {
  user: Omit<User, 'passwordHash'>;
  memberships: BusinessMember[];
  businesses: Business[];
}

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  memberships: BusinessMember[];
  businesses: Business[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  roleForBusiness: (businessId: string) => 'OWNER' | 'MANAGER' | 'STAFF' | 'NONE';
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'getlisted_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.user && parsed.user.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored auth session:', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const syncMe = async (userId: string) => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.getMe(userId);
      if (res && res.user) {
        setSession(res);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res));
      }
    } catch (err) {
      console.warn('User session invalid or expired:', err);
      setSession(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only synchronize if the user has an active session in local storage
    if (session?.user?.id) {
      syncMe(session.user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setSession(res);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res));
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register({ name, email, password });
    setSession(res);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setLoading(false);
  };

  const roleForBusiness = (businessId: string): 'OWNER' | 'MANAGER' | 'STAFF' | 'NONE' => {
    if (!session || !session.user) return 'NONE';
    const membership = session.memberships.find(m => m.businessId === businessId);
    if (membership) return membership.role;
    const isOwned = session.businesses.some(b => b.id === businessId && b.ownerId === session.user.id);
    if (isOwned) return 'OWNER';
    return 'NONE';
  };

  const refreshSession = async () => {
    if (session?.user?.id) {
      await syncMe(session.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        memberships: session?.memberships || [],
        businesses: session?.businesses || [],
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        roleForBusiness,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
