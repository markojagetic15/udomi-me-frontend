import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosProvider, GlobalProvider, Routing } from '_app';
import { ErrorBoundary } from '_app/ui/ErrorBoundary';
import { Toaster, TooltipProvider } from '_shared';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AxiosProvider>
          <GlobalProvider>
            <TooltipProvider delayDuration={300}>
              <Routing />
              <Toaster />
            </TooltipProvider>
          </GlobalProvider>
        </AxiosProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
