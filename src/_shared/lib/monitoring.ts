// Sentry is opt-in (VITE_SENTRY_DSN at build time) and loaded lazily, so it
// costs nothing for visitors when it's off.
const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
let sentry: Promise<typeof import('@sentry/react')> | null = null;

export const initMonitoring = () => {
  if (!dsn) return;
  sentry = import('@sentry/react').then((S) => {
    S.init({ dsn, environment: import.meta.env.MODE, sendDefaultPii: false });
    return S;
  });
};

// Always logged server-side (POST /api/client-errors, see backend
// ClientErrorController); also sent to Sentry when enabled.
export const reportError = (
  error: unknown,
  extra?: Record<string, unknown>
) => {
  sentry?.then((S) => S.captureException(error, { extra }));
  try {
    const e = error as Error;
    const body = JSON.stringify({
      message: String(e?.message ?? error).slice(0, 500),
      stack: e?.stack?.slice(0, 4000),
      componentStack:
        typeof extra?.componentStack === 'string'
          ? extra.componentStack.slice(0, 4000)
          : undefined,
      url: window.location.pathname.slice(0, 500),
      userAgent: navigator.userAgent.slice(0, 300),
    });
    fetch(`${import.meta.env.VITE_APP_BACKEND_URL as string}/client-errors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* never let reporting throw */
  }
};

// A deploy replaces the hashed JS chunks; a tab opened before it then fails to
// load code it hasn't fetched yet. Reload once (per tab session) to get the
// new build instead of showing the crash screen.
const STALE_KEY = 'udomi-chunk-reload';
export const isStaleChunkError = (e: unknown) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(
    String((e as Error)?.message ?? e)
  );

export const reloadForNewBuild = () => {
  try {
    if (sessionStorage.getItem(STALE_KEY)) return false;
    sessionStorage.setItem(STALE_KEY, '1');
  } catch {
    /* storage blocked: still reload once */
  }
  window.location.reload();
  return true;
};

export const markBuildLoaded = () => {
  try {
    sessionStorage.removeItem(STALE_KEY);
  } catch {
    /* ignore */
  }
};
