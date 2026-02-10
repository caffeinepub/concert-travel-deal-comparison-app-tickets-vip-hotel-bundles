import { useState, useMemo } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useSaveTripComparison } from '@/hooks/useQueries';
import { toast } from 'sonner';
import BundleCard from '@/components/results/BundleCard';
import BundleSortBar from '@/components/results/BundleSortBar';
import { generateBundles } from '@/lib/localComparisonEngine';
import type { TripBuilderState } from './TripBuilderPage';
import type { Bundle } from '@/lib/localComparisonEngine';

export type SortOption = 'price-asc' | 'hotel-rating';

export default function ResultsPage() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const saveMutation = useSaveTripComparison();
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');

  const tripData = (routerState.location.state as unknown) as TripBuilderState | undefined;

  const bundles = useMemo(() => {
    if (!tripData) return [];
    return generateBundles(tripData);
  }, [tripData]);

  const sortedBundles = useMemo(() => {
    const sorted = [...bundles];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.totalCost - b.totalCost);
    } else if (sortBy === 'hotel-rating') {
      sorted.sort((a, b) => {
        const ratingA = a.hotel.starRating ?? 0;
        const ratingB = b.hotel.starRating ?? 0;
        return ratingB - ratingA;
      });
    }
    return sorted;
  }, [bundles, sortBy]);

  const handleSave = async () => {
    if (!identity) {
      toast.error('Please sign in to save comparisons');
      return;
    }

    if (!tripData) {
      toast.error('No trip data to save');
      return;
    }

    try {
      await saveMutation.mutateAsync({
        tripData,
        bundles,
      });
      toast.success('Trip comparison saved!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save comparison');
    }
  };

  if (!tripData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Trip Data</h1>
        <p className="text-muted-foreground mb-8">Please build a trip first</p>
        <Button onClick={() => navigate({ to: '/trip-builder' })}>
          Go to Trip Builder
        </Button>
      </div>
    );
  }

  if (bundles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Bundles Available</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't generate any bundles with the provided options. Please check your inputs.
        </p>
        <Button onClick={() => navigate({ to: '/trip-builder' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trip Builder
        </Button>
      </div>
    );
  }

  const totalNights = tripData.daysBefore + tripData.daysAfter + 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/trip-builder' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trip Builder
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {tripData.eventName}
            </h1>
            <p className="text-muted-foreground text-lg">
              {tripData.eventCity} • {new Date(tripData.concertDate).toLocaleDateString()} • {tripData.travelers} {tripData.travelers === 1 ? 'traveler' : 'travelers'} • {totalNights} {totalNights === 1 ? 'night' : 'nights'}
            </p>
          </div>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Comparison'}
          </Button>
        </div>
      </div>

      <BundleSortBar sortBy={sortBy} onSortChange={setSortBy} />

      <div className="space-y-6 mt-6">
        {sortedBundles.map((bundle, index) => (
          <BundleCard
            key={index}
            bundle={bundle}
            travelers={tripData.travelers}
            nights={totalNights}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
