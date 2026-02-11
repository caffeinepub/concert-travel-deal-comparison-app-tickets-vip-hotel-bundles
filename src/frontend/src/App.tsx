import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import TripBuilderPage from './pages/TripBuilderPage';
import ResultsPage from './pages/ResultsPage';
import SavedComparisonsPage from './pages/SavedComparisonsPage';
import MemoryFinderPage from './pages/MemoryFinderPage';
import AlbumPage from './pages/AlbumPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import ProfilePage from './pages/ProfilePage';
import InstallAndroidPage from './pages/InstallAndroidPage';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/auth/RequireAuth';
import { registerServiceWorker } from './lib/pwa/registerServiceWorker';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SignInPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomePage,
});

const tripBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trip-builder',
  component: TripBuilderPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
});

const savedComparisonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/saved',
  component: SavedComparisonsPage,
});

const memoryFinderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memory-finder',
  component: MemoryFinderPage,
});

const albumRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memory-finder/$albumId',
  component: AlbumPage,
});

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/groups',
  component: GroupsPage,
});

const groupDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/groups/$groupId',
  component: GroupDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const installAndroidRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/install-android',
  component: InstallAndroidPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  tripBuilderRoute,
  resultsRoute,
  savedComparisonsRoute,
  memoryFinderRoute,
  albumRoute,
  groupsRoute,
  groupDetailRoute,
  profileRoute,
  installAndroidRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Global startup error state
let globalStartupError: string | null = null;

export function setGlobalStartupError(error: string) {
  globalStartupError = error;
  // Dispatch custom event so components can react
  window.dispatchEvent(new CustomEvent('startup-error', { detail: error }));
}

export function getGlobalStartupError(): string | null {
  return globalStartupError;
}

export default function App() {
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    // Register service worker for PWA support with error handling
    registerServiceWorker({
      onError: (error) => {
        const errorMessage = 'Service worker registration failed. The app may not work offline.';
        console.error(errorMessage, error);
        setGlobalStartupError(errorMessage);
        setForceUpdate(prev => prev + 1);
      },
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
