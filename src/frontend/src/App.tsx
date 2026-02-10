import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
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

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
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
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
