import { useGetMe, User } from '_entities/user';
import { createContext, useEffect, useState } from 'react';

export type GlobalContextType = {
  user: User | null;
  isAuthLoading: boolean;
};

export const GlobalContext = createContext<GlobalContextType>({
  user: null,
  isAuthLoading: true,
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const { user: me, isLoading: isAuthLoading } = useGetMe();

  useEffect(() => {
    setUser(me ?? null);
  }, [me]);

  return (
    <GlobalContext.Provider value={{ user, isAuthLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};
