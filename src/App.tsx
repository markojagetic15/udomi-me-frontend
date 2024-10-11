import { ToastContainer } from 'react-toastify';
import { AxiosProvider, Routing } from '_app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AxiosProvider>
        <Routing />
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          theme='colored'
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />
      </AxiosProvider>
    </QueryClientProvider>
  );
}

export default App;
