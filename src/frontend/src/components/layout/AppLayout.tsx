import { ReactNode, useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import TopNav from './TopNav';
import Footer from './Footer';
import { branding } from '@/config/branding';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const routerState = useRouterState();

  useEffect(() => {
    // Update document title based on current route and branding
    const baseTitle = branding.tagline 
      ? `${branding.appName} - ${branding.tagline}`
      : branding.appName;
    
    document.title = baseTitle;
  }, [routerState.location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
