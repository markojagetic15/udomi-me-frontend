import { useContext } from 'react';
import { GlobalContext } from './GlobalProvider';

export const useGlobalContext = () => {
  const { user, isAuthLoading } = useContext(GlobalContext);

  return { user, isAuthLoading };
};
