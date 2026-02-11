import { ReactNode, useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import TopNav from './TopNav';
import Footer from './Footer';
import OfflineStatusBanner from '../pwa/OfflineStatusBanner';
import StartupErrorBanner from '../pwa/StartupErrorBanner';
import { branding } from '@/config/branding';
import { getBackgroundForRoute, getAllBackgrounds } from '@/lib/routeBackgrounds';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const backgroundUrl = getBackgroundForRoute(currentPath);

  useEffect(() => {
    // Update document title based on current route and branding
    const baseTitle = branding.tagline 
      ? `${branding.appName} - ${branding.tagline}`
      : branding.appName;
    
    document.title = baseTitle;
  }, [currentPath]);

  useEffect(() => {
    // Preload all background images to minimize navigation jank
    const backgrounds = getAllBackgrounds();
    backgrounds.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col route-background-container">
      <OfflineStatusBanner />
      <StartupErrorBanner />
      <div 
        className="route-background-image"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="route-background-overlay" />
      <div className="route-content-wrapper">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
