import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
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
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  useEffect(() => {
    // Register service worker for PWA support
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
