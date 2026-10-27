import { useSearchParams } from 'react-router-dom';

export const useLostFound = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const type: 'lost' | 'found' =
    searchParams.get('type') === 'found' ? 'found' : 'lost';
  // Switching tabs keeps no filters — lost and found boards are separate.
  const setType = (t: 'lost' | 'found') =>
    setSearchParams(t === 'lost' ? {} : { type: t }, { replace: true });
  return { type, setType };
};
