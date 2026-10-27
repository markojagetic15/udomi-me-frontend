import { createContext } from 'react';
import { useGetMe, Me } from '_entities/user';

export type GlobalContextType = {
  user: Me | null;
  isAuthLoading: boolean;
};

export const GlobalContext = createContext<GlobalContextType>({
  user: null,
  isAuthLoading: true,
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  // Read straight from the query — copying it into state via useEffect lagged
  // one render behind isAuthLoading, so ProtectedRoute saw user=null on refresh.
  const { getMe } = useGetMe();

  return (
    <GlobalContext.Provider
      value={{ user: getMe.data ?? null, isAuthLoading: getMe.isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
