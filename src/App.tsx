import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { ToastContainer } from 'react-toastify';
import { AxiosProvider, Routing } from '_app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextUIProvider } from '@nextui-org/react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
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
      </NextUIProvider>
    </QueryClientProvider>
  );
}

export default App;
