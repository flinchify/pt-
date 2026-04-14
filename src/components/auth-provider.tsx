"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { AuthModal } from "./auth-modal";

type AuthMode = "login" | "signup";

export interface UserSession {
  role: "client" | "trainer" | "admin" | "gym" | "enterprise";
  user_id: number;
  email: string;
  name: string;
}

interface AuthContextValue {
  openLogin: () => void;
  openSignup: () => void;
  closeAuth: () => void;
  user: UserSession | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user as UserSession);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const openLogin = useCallback(() => {
    setAuthMode("login");
    setModalOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setAuthMode("signup");
    setModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    await fetchSession();
  }, [fetchSession]);

  const handleAuthSuccess = useCallback(async () => {
    setModalOpen(false);
    setLoading(true);
    await fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        openLogin,
        openSignup,
        closeAuth,
        user,
        loading,
        logout,
        refreshSession,
      }}
    >
      {children}
      <AuthModal
        open={modalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={closeAuth}
        onSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  );
}
