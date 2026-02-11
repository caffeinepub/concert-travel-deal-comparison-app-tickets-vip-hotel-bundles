/**
 * Route-to-background mapping utility for per-route landscape backgrounds.
 * Provides centralized mapping and inheritance rules for nested routes.
 */

interface RouteBackgroundMap {
  [key: string]: string;
}

const routeBackgrounds: RouteBackgroundMap = {
  '/': '/assets/generated/bg-signin-alps-sunrise.dim_1920x1080.png',
  '/home': '/assets/generated/bg-home-tokyo-night.dim_1920x1080.png',
  '/trip-builder': '/assets/generated/bg-tripbuilder-santorini.dim_1920x1080.png',
  '/results': '/assets/generated/bg-results-nyc-goldenhour.dim_1920x1080.png',
  '/saved': '/assets/generated/bg-saved-sahara-sunset.dim_1920x1080.png',
  '/memory-finder': '/assets/generated/bg-memoryfinder-iceland-waterfall.dim_1920x1080.png',
  '/groups': '/assets/generated/bg-groups-norway-fjord.dim_1920x1080.png',
  '/profile': '/assets/generated/bg-profile-machu-picchu.dim_1920x1080.png',
  '/install-android': '/assets/generated/bg-signin-alps-sunrise.dim_1920x1080.png',
};

/**
 * Resolves the background image URL for a given pathname.
 * Implements inheritance for nested routes:
 * - /memory-finder/$albumId inherits from /memory-finder
 * - /groups/$groupId inherits from /groups
 */
export function getBackgroundForRoute(pathname: string): string {
  // Direct match
  if (routeBackgrounds[pathname]) {
    return routeBackgrounds[pathname];
  }

  // Nested route inheritance
  if (pathname.startsWith('/memory-finder/')) {
    return routeBackgrounds['/memory-finder'];
  }

  if (pathname.startsWith('/groups/')) {
    return routeBackgrounds['/groups'];
  }

  // Default fallback to sign-in background
  return routeBackgrounds['/'];
}

/**
 * Returns all background URLs for optional preloading.
 */
export function getAllBackgrounds(): string[] {
  return Object.values(routeBackgrounds);
}
