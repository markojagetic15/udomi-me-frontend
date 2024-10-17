import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ForgotPassword, Home, Login, Register } from '_pages';
import { AppDrawer } from '_widgets';

const AppLayout = () => {
  const location = useLocation();

  const hideAppDrawerRoutes = ['/login', '/register', '/forgot-password'];

  return (
    <div>
      {!hideAppDrawerRoutes.includes(location.pathname) && <AppDrawer />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export const Routing = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};
