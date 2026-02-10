import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { branding } from '@/config/branding';
import { AlertCircle } from 'lucide-react';

interface UnauthSignInScreenProps {
  title: string;
  description: string;
  signInMessage: string;
}

export default function UnauthSignInScreen({
  title,
  description,
  signInMessage,
}: UnauthSignInScreenProps) {
  const { login, isLoggingIn, isLoginError } = useInternetIdentity();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-64 h-64 flex items-center justify-center">
            <img
              src={branding.logo.primary}
              alt={branding.logo.alt}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground text-lg mb-8">{description}</p>
      </div>
      <Card className="border-2">
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-lg mb-6">{signInMessage}</p>
          {isLoginError && (
            <Alert variant="destructive" className="mb-6 text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to start sign-in. Please try again or check your internet connection.
              </AlertDescription>
            </Alert>
          )}
          <Button size="lg" onClick={login} disabled={isLoggingIn}>
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
