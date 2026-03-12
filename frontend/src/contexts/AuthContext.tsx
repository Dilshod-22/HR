import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../api/client';
import { ROUTES } from '../constants/routes';

export interface AuthUser {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (u: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const s = localStorage.getItem(AUTH_USER_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(AUTH_USER_KEY);
  }, []);

  useEffect(() => {
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }
    api
      .get<AuthUser>('/auth/me')
      .then(({ data }) => {
        setUserState(data);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setToken(null);
        setUserState(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (loginName: string, password: string) => {
    const { data } = await api.post<{ accessToken: string; employee: AuthUser }>('/auth/login', {
      login: loginName,
      password,
    });
    setToken(data.accessToken);
    setUserState(data.employee);
    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.employee));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = ROUTES.LOGIN;
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
