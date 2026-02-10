import { useState, useEffect } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/useQueries';
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
  const saveMutation = useSaveCallerUserProfile();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
    setOpen(showProfileSetup);
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      await saveMutation.mutateAsync({ 
        name: name.trim(),
        parentPermissionConfirmed: false,
        friends: []
      });
      // Invalidate queries to refresh profile data
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      setOpen(false);
      setName('');
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
            Please tell us your name to get started with {branding.tagline.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saveMutation.isPending}
            className="w-full"
          >
            {saveMutation.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
