import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import TicketOffersEditor from '@/components/offers/TicketOffersEditor';
import VipOffersEditor from '@/components/offers/VipOffersEditor';
import HotelOffersEditor from '@/components/offers/HotelOffersEditor';
import type { Ticket, VIPPackage, Hotel } from '@/backend';

export interface TripBuilderState {
  eventName: string;
  eventCity: string;
  concertDate: string;
  travelers: number;
  daysBefore: number;
  daysAfter: number;
  tickets: Ticket[];
  vipPackages: VIPPackage[];
  hotels: Hotel[];
}

export default function TripBuilderPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<TripBuilderState>({
    eventName: '',
    eventCity: '',
    concertDate: '',
    travelers: 1,
    daysBefore: 0,
    daysAfter: 0,
    tickets: [],
    vipPackages: [],
    hotels: [],
  });

  const handleCompare = () => {
    if (!state.eventName || !state.eventCity || !state.concertDate) {
      alert('Please fill in event details');
      return;
    }
    if (state.tickets.length === 0) {
      alert('Please add at least one ticket option');
      return;
    }
    if (state.hotels.length === 0) {
      alert('Please add at least one hotel option');
      return;
    }

    navigate({
      to: '/results',
      state: state as any,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">RouteRally</h1>
        <p className="text-muted-foreground text-lg">
          Plan your concert trip and compare bundle deals to find the best route to savings
        </p>
      </div>

      <div className="space-y-6">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Details
            </CardTitle>
            <CardDescription>Tell us about the concert you're attending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  placeholder="e.g., Taylor Swift - Eras Tour"
                  value={state.eventName}
                  onChange={(e) => setState({ ...state, eventName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventCity">City *</Label>
                <Input
                  id="eventCity"
                  placeholder="e.g., Los Angeles, CA"
                  value={state.eventCity}
                  onChange={(e) => setState({ ...state, eventCity: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="concertDate">Concert Date *</Label>
                <Input
                  id="concertDate"
                  type="date"
                  value={state.concertDate}
                  onChange={(e) => setState({ ...state, concertDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelers">Travelers</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={state.travelers}
                  onChange={(e) => setState({ ...state, travelers: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="daysBefore">Days Before Concert</Label>
                <Input
                  id="daysBefore"
                  type="number"
                  min="0"
                  value={state.daysBefore}
                  onChange={(e) => setState({ ...state, daysBefore: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daysAfter">Days After Concert</Label>
                <Input
                  id="daysAfter"
                  type="number"
                  min="0"
                  value={state.daysAfter}
                  onChange={(e) => setState({ ...state, daysAfter: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Options */}
        <TicketOffersEditor
          tickets={state.tickets}
          onChange={(tickets) => setState({ ...state, tickets })}
        />

        {/* VIP Packages */}
        <VipOffersEditor
          vipPackages={state.vipPackages}
          onChange={(vipPackages) => setState({ ...state, vipPackages })}
        />

        {/* Hotel Options */}
        <HotelOffersEditor
          hotels={state.hotels}
          onChange={(hotels) => setState({ ...state, hotels })}
        />

        {/* Compare Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleCompare}>
            Compare Bundles
          </Button>
        </div>
      </div>
    </div>
  );
}
