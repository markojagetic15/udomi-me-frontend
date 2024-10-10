import { ToastContainer } from 'react-toastify';
import { AxiosProvider, Routing } from '@application';

function App() {
  return (
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
  );
}

export default App;
