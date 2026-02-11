import { useState, useEffect } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveUserProfile } from '@/hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { branding } from '@/config/branding';

export default function ProfileSetupDialog() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveUserProfile();
  const queryClient = useQueryClient();
  const [screenName, setScreenName] = useState('');
  const [open, setOpen] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
    setOpen(showProfileSetup);
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleSave = async () => {
    if (!screenName.trim()) return;

    try {
      await saveMutation.mutateAsync({ 
        publicScreenName: screenName.trim(),
        parentPermissionConfirmed: false,
        friends: []
      });
      // Invalidate queries to refresh profile data
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      setOpen(false);
      setScreenName('');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to {branding.appName}</DialogTitle>
          <DialogDescription>
            Choose a screen name to get started. This is your public username that others will see.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="screenName">Screen Name / Username</Label>
            <Input
              id="screenName"
              placeholder="Enter your screen name"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && screenName.trim()) {
                  handleSave();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              This is your public display name for safety. Your legal name will be requested separately for checkout.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!screenName.trim() || saveMutation.isPending}
            className="w-full"
          >
            {saveMutation.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
