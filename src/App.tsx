import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { ToastContainer } from 'react-toastify';
import { AxiosProvider, GlobalProvider, Routing } from '_app';
import { ErrorBoundary } from '_app/ui/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextUIProvider } from '@nextui-org/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <AxiosProvider>
            <GlobalProvider>
              <Routing />
              <ToastContainer
                position='bottom-right'
                autoClose={4000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
              />
            </GlobalProvider>
          </AxiosProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
