import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  CreateListing,
  ForgotPassword,
  Home,
  Login,
  Register,
  MyListings,
  AnimalInfo,
  GoogleCallback,
} from '_pages';
import { AppDrawer } from '_widgets';
import { AuthGuard } from './api';

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
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/my-listings' element={<MyListings />} />
        <Route path='/animal/:id' element={<AnimalInfo />} />
        <Route path='/google-callback' element={<GoogleCallback />} />
      </Routes>
    </div>
  );
};

export const Routing = () => {
  return (
    <Router>
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    </Router>
  );
};
