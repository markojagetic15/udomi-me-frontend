import React, { createContext, useMemo } from 'react';
import Axios, { AxiosInstance } from 'axios';

export type AxiosContextType = {
  axios: AxiosInstance;
};

export const AxiosContext = createContext<AxiosContextType>({
  axios: Axios,
});

const extractMessage = (data: unknown, fallback: string): string => {
  const raw = (data as { message?: unknown })?.message;
  if (!raw) return fallback;
  if (Array.isArray(raw)) return String(raw[0] ?? fallback);
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
      // Hooks receive the payload directly, not the Axios response.
      (response) => response.data,
      (error) => {
        error.message = extractMessage(error.response?.data, error.message);
        // A banned account is logged out everywhere it's used.
        if (
          error.response?.status === 403 &&
          error.message === 'ACCOUNT_BANNED'
        ) {
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?error=banned';
          }
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
