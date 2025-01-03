import { useContext } from 'react';
import { GlobalContext } from './GlobalProvider';

export const useGlobalContext = () => {
  const { user } = useContext(GlobalContext);

  return { user };
};
