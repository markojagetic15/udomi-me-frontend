import { useContext } from 'react';
import { AxiosContext } from './AxiosProvider';

export const useAxios = () => useContext(AxiosContext);
