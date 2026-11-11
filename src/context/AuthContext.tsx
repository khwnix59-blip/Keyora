import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, loginAdminUser, logoutAdminUser, subscribeToAuthState } from '../firebase/service';
import { isFirebaseConfigured } from '../firebase/config';

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await loginAdminUser(email, pass);
    setUser(loggedUser);
  };

  const logout = async () => {
    await logoutAdminUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user && user.role === 'admin'),
        loading,
        login,
        logout,
        isFirebaseActive: isFirebaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
