import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import {
  isStaleChunkError,
  markBuildLoaded,
  PageLoader,
  reloadForNewBuild,
} from '_shared';
import {
  AppFooter,
  AppHeader,
  CookieNotice,
  VerifyEmailBanner,
} from '_widgets';
import { AdminRoute, GuestRoute, ProtectedRoute } from './api/AuthGuard';
import { useGlobalContext } from './api/useGlobalContext';

// After a deploy, an open tab still references the previous build's chunk
// files, which no longer exist — reload once to pick up the new build.
const page = <K extends string>(
  load: () => Promise<Record<K, React.ComponentType>>,
  name: K
) =>
  lazy(() =>
    load()
      .then((m) => {
        markBuildLoaded();
        return { default: m[name] };
      })
      .catch((err) => {
        if (isStaleChunkError(err) && reloadForNewBuild()) {
          return new Promise<never>(() => undefined);
        }
        throw err;
      })
  );

const Landing = page(() => import('_pages/landing'), 'Landing');
const Browse = page(() => import('_pages/browse'), 'Browse');
const LostFound = page(() => import('_pages/lost-found'), 'LostFound');
const Stories = page(() => import('_pages/stories'), 'Stories');
const ListingDetail = page(
  () => import('_pages/listing-detail'),
  'ListingDetail'
);
const CreateListing = page(
  () => import('_pages/create-listing'),
  'CreateListing'
);
const EditListing = page(() => import('_pages/edit-listing'), 'EditListing');
const PublicProfile = page(
  () => import('_pages/public-profile'),
  'PublicProfile'
);
const Messages = page(() => import('_pages/messages'), 'Messages');
const Notifications = page(
  () => import('_pages/notifications'),
  'Notifications'
);
const Profile = page(() => import('_pages/profile'), 'Profile');
const Admin = page(() => import('_pages/admin'), 'Admin');
const Login = page(() => import('_pages/auth'), 'Login');
const Register = page(() => import('_pages/auth'), 'Register');
const ForgotPassword = page(() => import('_pages/auth'), 'ForgotPassword');
const ResetPassword = page(() => import('_pages/auth'), 'ResetPassword');
const VerifyEmail = page(() => import('_pages/auth'), 'VerifyEmail');
const GoogleCallback = page(() => import('_pages/auth'), 'GoogleCallback');
const Privacy = page(() => import('_pages/legal'), 'Privacy');
const Terms = page(() => import('_pages/legal'), 'Terms');
const ErrorPage = page(() => import('_pages/error'), 'ErrorPage');

// Full-screen pages with their own layout (no header/footer).
const BARE_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  // Braces matter: an effect's return value is its cleanup, and newer Chrome
  // returns a Promise from scrollTo — returning it crashed every navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppLayout = () => {
  const location = useLocation();
  const { isAuthLoading } = useGlobalContext();
  const bare = BARE_ROUTES.includes(location.pathname);
  // Messages is an app-like full-height view: no footer.
  const noFooter = bare || location.pathname.startsWith('/messages');

  if (isAuthLoading) return <PageLoader />;

  return (
    <div className='flex min-h-[100dvh] flex-col'>
      <ScrollToTop />
      {!bare && (
        <>
          <AppHeader />
          <VerifyEmailBanner />
        </>
      )}
      <main className='flex-1'>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/browse' element={<Browse />} />
            <Route path='/lost-found' element={<LostFound />} />
            <Route path='/stories' element={<Stories />} />
            <Route path='/animal/:id' element={<ListingDetail />} />
            <Route path='/users/:id' element={<PublicProfile />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/terms' element={<Terms />} />

            <Route
              path='/login'
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path='/register'
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/verify-email' element={<VerifyEmail />} />
            <Route path='/google-callback' element={<GoogleCallback />} />

            <Route
              path='/create-listing'
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path='/edit-listing/:id'
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            <Route
              path='/messages'
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path='/messages/:id'
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path='/notifications'
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin'
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* Old URL from the previous design. */}
            <Route path='/home' element={<Navigate to='/browse' replace />} />
            <Route path='/error/:code' element={<ErrorPage />} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </main>
      {!noFooter && <AppFooter />}
      <CookieNotice />
    </div>
  );
};

export const Routing = () => (
  <Router>
    <AppLayout />
  </Router>
);
