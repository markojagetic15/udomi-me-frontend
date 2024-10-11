import React, { createContext, useMemo } from 'react';
import Axios, { AxiosInstance } from 'axios';

export type AxiosContextType = {
  axios: AxiosInstance;
};

export const AxiosContext = createContext<AxiosContextType>({
  axios: Axios,
});

export const AxiosProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const createAxiosWithBaseUrl = (baseURL: string) => {
    return Axios.create({
      baseURL,
      withCredentials: true,
    });
  };

  const backendService = useMemo(() => {
    return createAxiosWithBaseUrl(
      import.meta.env.VITE_APP_BACKEND_URL as string
    );
  }, []);

  return React.createElement(
    AxiosContext.Provider,
    {
      value: {
        axios: backendService,
      },
    },
    children
  );
};
