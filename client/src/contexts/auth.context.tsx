import { createContext, useState, ReactNode, useEffect } from 'react';
import { useLoginMutation, useMeQuery, User } from '@/types/graphql-generated';

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [loginMutation] = useLoginMutation();
  const { data: meData } = useMeQuery();

  useEffect(() => {
    if (!meData) return;
    const fetchUser = async () => {
      setUser(meData.me as User);
      setIsLoading(false);
    };
    fetchUser();
  }, [meData]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (data?.login) {
        setUser(data.login.user as User);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
