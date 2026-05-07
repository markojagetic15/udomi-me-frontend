import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from '_shared';
import { AppDrawer } from '_widgets';
import { Footer } from '_shared';
import { GuestRoute, ProtectedRoute } from './api/AuthGuard';
import { useGlobalContext } from './api/useGlobalContext';

const Landing = lazy(() => import('_pages/landing').then((m) => ({ default: m.Landing })));
const Home = lazy(() => import('_pages/home').then((m) => ({ default: m.Home })));
const Login = lazy(() => import('_pages/login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('_pages/register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('_pages/forgot-password').then((m) => ({ default: m.ForgotPassword })));
const VerifyEmail = lazy(() => import('_pages/verify-email').then((m) => ({ default: m.VerifyEmail })));
const Profile = lazy(() => import('_pages/profile').then((m) => ({ default: m.Profile })));
const CreateListing = lazy(() => import('_pages/create-listing').then((m) => ({ default: m.CreateListing })));
const EditListing = lazy(() => import('_pages/edit-listing').then((m) => ({ default: m.EditListing })));
const AnimalInfo = lazy(() => import('_pages/single-listing').then((m) => ({ default: m.AnimalInfo })));
const GoogleCallback = lazy(() => import('_pages/google-callback').then((m) => ({ default: m.GoogleCallback })));
const ErrorPage = lazy(() => import('_pages/error').then((m) => ({ default: m.ErrorPage })));

const AppLayout = () => {
  const location = useLocation();
  const { isAuthLoading } = useGlobalContext();

  const hideAppDrawerRoutes = ['/login', '/register', '/forgot-password'];
  const hideFooterRoutes = ['/login', '/register', '/forgot-password', '/'];

  if (isAuthLoading) return <PageLoader />;

  return (
    <div>
      {!hideAppDrawerRoutes.includes(location.pathname) && <AppDrawer />}
      <Suspense fallback={<PageLoader />}>
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
