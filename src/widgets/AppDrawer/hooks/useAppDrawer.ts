import { useNavigate } from 'react-router-dom';

export const useAppDrawer = () => {
  const navigate = useNavigate();

  return {
    navigate,
  };
};
