import React, { createContext, useMemo } from 'react';
import Axios, { AxiosInstance } from 'axios';

export type AxiosContextType = {
  service: AxiosInstance;
};

export const AxiosContext = createContext<AxiosContextType>({
  service: Axios,
});

export const AxiosProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const createAxiosWithBaseUrl = (baseURL: string) => {
    return Axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        Authorization: 'Bearer',
      },
    });
  };

  const backendService = useMemo(() => {
    return createAxiosWithBaseUrl(import.meta.env.VITE_BACKEND_URL as string);
  }, []);

  return React.createElement(
    AxiosContext.Provider,
    {
      value: {
        service: backendService,
      },
    },
    children
  );
};
