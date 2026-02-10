import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSetParentPermission } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, LogIn } from 'lucide-react';
import { toast } from 'sonner';

interface PurchaseConsentGateProps {
  children: React.ReactNode;
}

export default function PurchaseConsentGate({ children }: PurchaseConsentGateProps) {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const setPermissionMutation = useSetParentPermission();
  const [consentChecked, setConsentChecked] = useState(false);

  const isAuthenticated = !!identity;
  const hasConsent = profile?.parentPermissionConfirmed ?? false;

  const handleConfirmConsent = async () => {
    if (!consentChecked) {
      toast.error('Please check the box to confirm');
      return;
    }

    try {
      await setPermissionMutation.mutateAsync(true);
      toast.success('Permission confirmed!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save permission');
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Sign In Required
          </CardTitle>
          <CardDescription>
            You need to sign in to continue with purchasing options. Your consent will be saved to your account.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!hasConsent) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Parent/Guardian Permission Required
          </CardTitle>
          <CardDescription>
            If you're under 18, you need permission from a parent or guardian to view ticket purchasing options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Important:</strong> TicketStay helps you compare travel packages but does not process payments or sell tickets. 
              You'll be directed to official ticket sellers and hotel booking sites.
            </AlertDescription>
          </Alert>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked === true)}
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              I confirm that I am 18 or older, OR I have permission from my parent or guardian to view ticket purchasing options.
            </Label>
          </div>
          <Button
            onClick={handleConfirmConsent}
            disabled={!consentChecked || setPermissionMutation.isPending}
            className="w-full"
          >
            {setPermissionMutation.isPending ? 'Confirming...' : 'Confirm Permission'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
