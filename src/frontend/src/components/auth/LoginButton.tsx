import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import ProfileSetupDialog from './ProfileSetupDialog';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
        // Navigate to profile after successful login
        setTimeout(() => {
          navigate({ to: '/profile' });
        }, 500);
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Unable to sign in. Please try again.');
        }
      }
    }
  };

  return (
    <>
      <ProfileSetupDialog />
      <Button
        onClick={handleAuth}
        disabled={disabled}
        variant={isAuthenticated ? 'outline' : 'default'}
        size="sm"
      >
        {loginStatus === 'logging-in' ? (
          'Signing in...'
        ) : isAuthenticated ? (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </Button>
    </>
  );
}
