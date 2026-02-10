import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import UnauthSignInScreen from '@/components/auth/UnauthSignInScreen';

export default function SignInPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/profile' });
    }
  }, [identity, navigate]);

  if (identity) {
    return null;
  }

  return (
    <UnauthSignInScreen
      title="Welcome to EOA"
      description="Sign in to access your concert travel planning tools and saved comparisons."
      signInMessage="Please sign in with Internet Identity to continue."
    />
  );
}
