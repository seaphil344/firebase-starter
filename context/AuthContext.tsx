'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { firebase_app } from '@/firebase/config';

const auth = getAuth(firebase_app);

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the authentication context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}
});

// Custom hook to access the authentication context
export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const whitelist = ['/','/auth/signin', '/auth/signup', '/auth/send-verification-email', '/auth/reset-password-request'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified === false && process.env.NEXT_PUBLIC_LIMIT_UNVERIFIED_USE === 'true' && !whitelist.includes(pathname)) {
          router.push("/auth/send-verification-email");
        } else {
          setUser(user);
        }
      } else {
        if (!whitelist.includes(pathname)) {
          router.push("/auth/signin");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
