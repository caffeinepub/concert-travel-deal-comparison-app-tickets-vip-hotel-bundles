import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetUserComparisons, useDeleteComparison } from '@/hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import UnauthSignInScreen from '@/components/auth/UnauthSignInScreen';
import LegalNameSection from '@/components/profile/LegalNameSection';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: comparisons, isLoading: comparisonsLoading } = useGetUserComparisons();
  const deleteMutation = useDeleteComparison();
  const navigate = useNavigate();

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Comparison deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comparison');
      console.error('Delete error:', error);
    }
  };

  if (!identity) {
    return (
      <UnauthSignInScreen
        title="VibeVoyager"
        description="Your personal concert travel hub"
        signInMessage="Sign in to access your travel dashboard"
      />
    );
  }

  if (profileLoading || comparisonsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayName = profile?.publicScreenName || 'User';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">VibeVoyager</h1>
        <p className="text-muted-foreground text-lg">
          Your concert travel dashboard and saved trips
        </p>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Screen Name</p>
                <p className="text-lg font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Principal ID</p>
                <p className="text-xs font-mono break-all">{identity.getPrincipal().toString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Name Section */}
        <LegalNameSection />

        {/* Saved Comparisons */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Saved Trips
                </CardTitle>
                <CardDescription>
                  {comparisons?.length || 0} saved {comparisons?.length === 1 ? 'comparison' : 'comparisons'}
                </CardDescription>
              </div>
              <Button onClick={() => navigate({ to: '/trip-builder' })}>
                Plan New Trip
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!comparisons || comparisons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No saved trips yet</p>
                <Button onClick={() => navigate({ to: '/trip-builder' })}>
                  Start with RouteRally
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {comparisons.map((comparison) => {
                  const upgradeCount = comparison.upgradeAlternatives.length;
                  const hasPlannedChoice = comparison.userChoice !== null && comparison.userChoice !== undefined;

                  return (
                    <div
                      key={comparison.id.toString()}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{comparison.event}</p>
                          {hasPlannedChoice && (
                            <Badge variant="outline" className="text-xs">Planned</Badge>
                          )}
                          {upgradeCount > 0 && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {upgradeCount} upgrade{upgradeCount === 1 ? '' : 's'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Number(comparison.travelWindow.checkIn) / 1000000).toLocaleDateString()}
                          {hasPlannedChoice && comparison.userChoice && (
                            <> • {comparison.userChoice.ticket.name} + {comparison.userChoice.hotel.name}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate({ to: '/saved' })}
                        >
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this saved trip. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(comparison.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
