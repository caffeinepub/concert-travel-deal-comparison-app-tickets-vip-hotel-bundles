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
      description="Your secure concert travel planning platform. Access all your trip planning tools with a single secure sign-in."
      signInMessage="Sign in securely using passkeys with Internet Identity. No passwords required—just fast, secure authentication."
    />
  );
}
