import { useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const routerState = useRouterState();
  
  const currentPath = routerState.location.pathname;
  const isSignInPage = currentPath === '/';
  const isInstallAndroidPage = currentPath === '/install-android';
  
  useEffect(() => {
    // Don't redirect if we're still initializing or on public pages
    if (isInitializing || isSignInPage || isInstallAndroidPage) {
      return;
    }
    
    // Redirect to sign-in if not authenticated and trying to access protected route
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, isInitializing, isSignInPage, isInstallAndroidPage, navigate]);
  
  // Allow public pages to render always
  if (isSignInPage || isInstallAndroidPage) {
    return <>{children}</>;
  }
  
  // Show nothing while initializing or redirecting
  if (isInitializing || !identity) {
    return null;
  }
  
  // Render protected content
  return <>{children}</>;
}
