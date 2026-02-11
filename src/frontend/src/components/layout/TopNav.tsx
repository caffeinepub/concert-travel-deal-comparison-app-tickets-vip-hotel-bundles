import { useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User } from 'lucide-react';
import LoginButton from '@/components/auth/LoginButton';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { branding } from '@/config/branding';

export default function TopNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => routerState.location.pathname === path;
  const isAuthenticated = !!identity;

  // Define nav items based on auth state
  const navItems = isAuthenticated
    ? [
        { path: '/trip-builder', label: 'RouteRally' },
        { path: '/saved', label: 'CostCompass' },
        { path: '/memory-finder', label: 'EchoPass' },
        { path: '/groups', label: 'NovaTrips' },
      ]
    : [];

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  // Safe display name with fallback
  const displayName = profile?.publicScreenName || 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNavigate(isAuthenticated ? '/profile' : '/')}
              className="flex items-center gap-3 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <img
                src={branding.logo.primary}
                alt={branding.logo.alt}
                className="h-8 w-8 object-contain"
              />
              <span>{branding.appName}</span>
            </button>
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? 'secondary' : 'ghost'}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && profile && (
              <>
                <Button
                  variant={isActive('/profile') ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavigate('/profile')}
                  className="hidden sm:flex"
                >
                  <User className="mr-2 h-4 w-4" />
                  {displayName}
                </Button>
                <Button
                  variant={isActive('/profile') ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => handleNavigate('/profile')}
                  className="sm:hidden"
                >
                  <User className="h-4 w-4" />
                </Button>
              </>
            )}
            <LoginButton />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? 'secondary' : 'ghost'}
                      onClick={() => handleNavigate(item.path)}
                      className="justify-start"
                    >
                      {item.label}
                    </Button>
                  ))}
                  {isAuthenticated && profile && (
                    <Button
                      variant={isActive('/profile') ? 'secondary' : 'ghost'}
                      onClick={() => handleNavigate('/profile')}
                      className="justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {displayName}
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
