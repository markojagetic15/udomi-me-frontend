import React, { createContext, useMemo } from 'react';
import Axios, { AxiosInstance } from 'axios';

export type AxiosContextType = {
  axios: AxiosInstance;
};

export const AxiosContext = createContext<AxiosContextType>({
  axios: Axios,
});

const AUTH_ENDPOINTS = ['/login', '/signup', '/forgot-password', '/reset-password', '/change-password'];

const extractMessage = (data: any, fallback: string): string => {
  const raw = data?.message;
  if (!raw) return fallback;
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  return String(raw);
};

export const AxiosProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const backendService = useMemo(() => {
    const instance = Axios.create({
      baseURL: import.meta.env.VITE_APP_BACKEND_URL as string,
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const status: number = error.response?.status ?? 0;
        const url: string = error.config?.url ?? '';
        const isAuthEndpoint = AUTH_ENDPOINTS.some((e) => url.includes(e));

        error.message = extractMessage(error.response?.data, error.message);

        if (status === 401 && !isAuthEndpoint && !url.includes('/me')) {
          window.location.href = '/login';
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return (
    <AxiosContext.Provider value={{ axios: backendService }}>
      {children}
    </AxiosContext.Provider>
  );
};
