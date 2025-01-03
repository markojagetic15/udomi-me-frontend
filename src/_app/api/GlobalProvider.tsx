import { useGetMe, User } from '_entities/user';
import { createContext, useEffect, useState } from 'react';

export type GlobalContextType = {
  user: User | null;
};

export const GlobalContext = createContext<GlobalContextType>({
  user: null,
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const { user: me } = useGetMe();

  useEffect(() => {
    if (me) {
      setUser(me);
    }
  }, [me]);

  return (
    <GlobalContext.Provider value={{ user: user }}>
      {children}
    </GlobalContext.Provider>
  );
};
