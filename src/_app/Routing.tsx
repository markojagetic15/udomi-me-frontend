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
  Landing,
  Login,
  Register,
  AnimalInfo,
  GoogleCallback,
  Profile,
} from '_pages';
import { ErrorPage } from '_pages/error';
import { AppDrawer } from '_widgets';
import { Footer } from '_shared';
import { GuestRoute, ProtectedRoute } from './api/AuthGuard';

// Lazy-loaded pages
import { lazy, Suspense } from 'react';
const EditListing = lazy(() =>
  import('_pages/edit-listing').then((m) => ({ default: m.EditListing })),
);
const VerifyEmail = lazy(() =>
  import('_pages/verify-email').then((m) => ({ default: m.VerifyEmail })),
);

const AppLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const hideAppDrawerRoutes = ['/login', '/register', '/forgot-password'];
  const hideFooterRoutes = ['/login', '/register', '/forgot-password', '/'];

  return (
    <div>
      {!hideAppDrawerRoutes.includes(location.pathname) && <AppDrawer />}
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/browse' element={<Home />} />

          <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
          <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-email' element={<VerifyEmail />} />

          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/create-listing' element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path='/edit-listing/:id' element={<ProtectedRoute><EditListing /></ProtectedRoute>} />

          <Route path='/animal/:id' element={<AnimalInfo />} />
          <Route path='/google-callback' element={<GoogleCallback />} />

          <Route path='/error/400' element={<ErrorPage code={400} />} />
          <Route path='/error/401' element={<ErrorPage code={401} />} />
          <Route path='/error/403' element={<ErrorPage code={403} />} />
          <Route path='/error/404' element={<ErrorPage code={404} />} />
          <Route path='/error/408' element={<ErrorPage code={408} />} />
          <Route path='/error/429' element={<ErrorPage code={429} />} />
          <Route path='/error/500' element={<ErrorPage code={500} />} />
          <Route path='/error/502' element={<ErrorPage code={502} />} />
          <Route path='/error/503' element={<ErrorPage code={503} />} />
          <Route path='*' element={<ErrorPage code={404} />} />
        </Routes>
      </Suspense>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
};

export const Routing = () => (
  <Router>
    <AppLayout />
  </Router>
);
