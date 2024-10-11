import { useContext } from 'react';
import { AxiosContext } from '_app';

export const useAxios = () => useContext(AxiosContext);
