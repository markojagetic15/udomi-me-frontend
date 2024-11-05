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
    const instance = Axios.create({
      baseURL,
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          error.message = error.response.data.message;
        }
        return Promise.reject(error);
      }
    );

    return instance;
  };

  const backendService = useMemo(() => {
    return createAxiosWithBaseUrl(
      import.meta.env.VITE_APP_BACKEND_URL as string
    );
  }, []);

  return (
    <AxiosContext.Provider value={{ axios: backendService }}>
      {children}
    </AxiosContext.Provider>
  );
};
