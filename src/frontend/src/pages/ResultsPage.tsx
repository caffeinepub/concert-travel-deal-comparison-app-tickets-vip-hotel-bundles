import { useState, useMemo } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Info } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useSaveTripComparison } from '@/hooks/useQueries';
import { toast } from 'sonner';
import BundleCard from '@/components/results/BundleCard';
import BundleSortBar from '@/components/results/BundleSortBar';
import { generateBundles, findCheapestTransport } from '@/lib/localComparisonEngine';
import { detectUpgrades } from '@/lib/upgradeDetection';
import type { TripBuilderState } from './TripBuilderPage';
import type { Bundle } from '@/lib/localComparisonEngine';

export type SortOption = 'price-asc' | 'hotel-rating';

export default function ResultsPage() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const saveMutation = useSaveTripComparison();
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [selectedBundleIndex, setSelectedBundleIndex] = useState<number | null>(null);

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

  const selectedBundle = selectedBundleIndex !== null ? sortedBundles[selectedBundleIndex] : null;
  
  const upgrades = useMemo(() => {
    if (!selectedBundle) return null;
    return detectUpgrades(selectedBundle, sortedBundles);
  }, [selectedBundle, sortedBundles]);

  const cheapestTransport = useMemo(() => {
    if (!tripData || tripData.transportOffers.length === 0) return null;
    return findCheapestTransport(tripData, sortedBundles[0]?.currency || 'USD');
  }, [tripData, sortedBundles]);

  const handleSave = async () => {
    if (!identity) {
      toast.error('Please sign in to save comparisons');
      return;
    }

    if (!tripData) {
      toast.error('No trip data to save');
      return;
    }

    if (selectedBundleIndex === null) {
      toast.error('Please select your planned choice before saving');
      return;
    }

    try {
      await saveMutation.mutateAsync({
        tripData,
        bundles,
        selectedBundle: sortedBundles[selectedBundleIndex],
        upgrades: upgrades || { tickets: [], transport: [], hotelRooms: [] },
      });
      toast.success('Trip comparison saved with your planned choice and upgrade alternatives!');
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
  const hasTransport = tripData.transportOffers.length > 0;
  const totalUpgrades = upgrades ? upgrades.tickets.length + upgrades.transport.length + upgrades.hotelRooms.length : 0;

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
          <Button 
            onClick={handleSave} 
            disabled={saveMutation.isPending || selectedBundleIndex === null}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Comparison'}
          </Button>
        </div>
      </div>

      {hasTransport && cheapestTransport && (
        <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">Transportation Included</p>
                <p className="text-sm text-muted-foreground">
                  Bundle totals include transportation costs. Cheapest option: {cheapestTransport.provider} ({cheapestTransport.classLabel}) at {cheapestTransport.currency} {cheapestTransport.price.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planned Choice Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Your Planned Choice</CardTitle>
          <CardDescription>
            Choose the bundle you're planning to book. We'll flag better-value upgrades for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="planned-choice">Your Baseline Choice</Label>
            <Select
              value={selectedBundleIndex?.toString() || ''}
              onValueChange={(value) => setSelectedBundleIndex(parseInt(value))}
            >
              <SelectTrigger id="planned-choice">
                <SelectValue placeholder="Select a bundle as your planned choice" />
              </SelectTrigger>
              <SelectContent>
                {sortedBundles.map((bundle, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    #{index + 1} - {bundle.ticket.name} + {bundle.hotel.name} ({bundle.roomType.name}) {bundle.transport ? `+ ${bundle.transport.provider}` : ''} - {bundle.currency} {bundle.totalCost.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBundle && totalUpgrades > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ Found {totalUpgrades} better-value upgrade{totalUpgrades === 1 ? '' : 's'} for your planned choice
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <BundleSortBar sortBy={sortBy} onSortChange={setSortBy} />

      <div className="space-y-6 mt-6">
        {sortedBundles.map((bundle, index) => {
          const isPlanned = selectedBundleIndex === index;
          const isUpgrade = upgrades && (
            upgrades.tickets.some(b => 
              b.ticket.id === bundle.ticket.id &&
              b.hotel.name === bundle.hotel.name &&
              b.roomType.name === bundle.roomType.name
            ) ||
            upgrades.transport.some(b => 
              b.transport?.id === bundle.transport?.id &&
              b.ticket.id === bundle.ticket.id &&
              b.hotel.name === bundle.hotel.name
            ) ||
            upgrades.hotelRooms.some(b => 
              b.roomType.name === bundle.roomType.name &&
              b.ticket.id === bundle.ticket.id &&
              b.hotel.name === bundle.hotel.name
            )
          );

          return (
            <BundleCard
              key={index}
              bundle={bundle}
              travelers={tripData.travelers}
              nights={totalNights}
              rank={index + 1}
              isPlannedChoice={isPlanned}
              isBetterValueUpgrade={isUpgrade || false}
            />
          );
        })}
      </div>
    </div>
  );
}
