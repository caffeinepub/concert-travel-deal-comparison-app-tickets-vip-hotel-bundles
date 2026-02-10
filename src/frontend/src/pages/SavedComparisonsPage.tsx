import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetUserComparisons, useDeleteComparison } from '@/hooks/useQueries';
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
import { Calendar, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import UnauthSignInScreen from '@/components/auth/UnauthSignInScreen';

export default function SavedComparisonsPage() {
  const { identity } = useInternetIdentity();
  const { data: comparisons, isLoading } = useGetUserComparisons();
  const deleteMutation = useDeleteComparison();

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
        title="CostCompass"
        description="Track and compare your saved concert travel bundles"
        signInMessage="Sign in to view your saved comparisons"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">CostCompass</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!comparisons || comparisons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">CostCompass</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Track and compare your saved concert travel bundles
        </p>
        <Card className="border-2">
          <CardContent className="pt-12 pb-12">
            <p className="text-lg mb-6">You haven't saved any comparisons yet</p>
            <Button size="lg" onClick={() => window.location.href = '/trip-builder'}>
              Start with RouteRally
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">CostCompass</h1>
        <p className="text-muted-foreground text-lg">
          Your saved concert travel comparisons and bundle options
        </p>
      </div>

      <div className="space-y-6">
        {comparisons.map((comparison) => {
          const upgradeCount = comparison.upgradeAlternatives.length;
          const hasPlannedChoice = comparison.userChoice !== null && comparison.userChoice !== undefined;

          return (
            <Card key={comparison.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{comparison.event}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(Number(comparison.travelWindow.checkIn) / 1000000).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
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
                        <AlertDialogTitle>Delete Comparison?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this saved comparison. This action cannot be undone.
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Ticket Options</p>
                      <p className="font-medium">{comparison.ticketSources.length} sources</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Hotel Options</p>
                      <p className="font-medium">{comparison.hotels.length} hotels</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">VIP Packages</p>
                      <p className="font-medium">{comparison.vipPackageOptions.length} options</p>
                    </div>
                  </div>

                  {hasPlannedChoice && comparison.userChoice && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium">Your Planned Choice</p>
                        <Badge variant="outline" className="text-xs">Baseline</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{comparison.userChoice.hotel.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {comparison.userChoice.ticket.name} • {comparison.userChoice.roomType.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {comparison.userChoice.ticket.currency}{' '}
                            {(comparison.userChoice.ticket.price + comparison.userChoice.roomType.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {upgradeCount > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          Better-Value Upgrades Found
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {upgradeCount} upgrade option{upgradeCount === 1 ? '' : 's'} flagged that {upgradeCount === 1 ? 'is' : 'are'} cheaper and higher quality than your planned choice
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
