import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Hotel, Ticket, Star, ExternalLink, Plane, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import PurchaseConsentGate from '@/components/safety/PurchaseConsentGate';
import type { Bundle } from '@/lib/localComparisonEngine';
import type { TicketType } from '@/backend';

interface BundleCardProps {
  bundle: Bundle;
  travelers: number;
  nights: number;
  rank: number;
  isPlannedChoice?: boolean;
  isBetterValueUpgrade?: boolean;
}

function getTicketTypeLabel(type: TicketType): string {
  if ('standard' in (type as any)) return 'Standard';
  if ('vip' in (type as any)) return 'VIP';
  return 'Unknown';
}

function getTransportModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    plane: 'Flight',
    train: 'Train',
    taxi: 'Taxi',
    ground: 'Ground Transport',
  };
  return labels[mode] || mode;
}

export default function BundleCard({ 
  bundle, 
  travelers, 
  nights, 
  rank,
  isPlannedChoice = false,
  isBetterValueUpgrade = false,
}: BundleCardProps) {
  const perPersonCost = bundle.totalCost / travelers;
  const isOfficialVIP = bundle.isOfficialVIP;
  const ticketTypeLabel = getTicketTypeLabel(bundle.ticket.type);

  return (
    <Card className={`border-2 transition-colors ${
      isPlannedChoice ? 'border-primary bg-primary/5' : 
      isBetterValueUpgrade ? 'border-green-500/50 bg-green-500/5' :
      'hover:border-primary/50'
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={rank === 1 ? 'default' : 'secondary'}>
                #{rank}
              </Badge>
              {isPlannedChoice && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Your Planned Choice
                </Badge>
              )}
              {isBetterValueUpgrade && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Better Value Upgrade
                </Badge>
              )}
              {isOfficialVIP && (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Official VIP
                </Badge>
              )}
              {!isOfficialVIP && bundle.vipPackage && (
                <Badge variant="outline">VIP-Style Bundle</Badge>
              )}
            </div>
            <CardTitle className="text-2xl">
              {formatCurrency(bundle.totalCost, bundle.currency)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(perPersonCost, bundle.currency)} per person
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ticket */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Ticket className="h-4 w-4" />
            <span>Ticket</span>
          </div>
          <div className="pl-6">
            <p className="font-medium">{bundle.ticket.name}</p>
            <p className="text-sm text-muted-foreground">
              {ticketTypeLabel} • {formatCurrency(bundle.ticket.price, bundle.ticket.currency)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Hotel */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Hotel className="h-4 w-4" />
            <span>Hotel</span>
          </div>
          <div className="pl-6">
            <div className="flex items-center gap-2">
              <p className="font-medium">{bundle.hotel.name}</p>
              {bundle.hotel.starRating && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs">{bundle.hotel.starRating}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {bundle.roomType.name} • {nights} {nights === 1 ? 'night' : 'nights'} • {formatCurrency(bundle.roomType.price * nights, bundle.currency)}
            </p>
          </div>
        </div>

        {/* Transport if present */}
        {bundle.transport && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Plane className="h-4 w-4" />
                <span>Transportation</span>
              </div>
              <div className="pl-6">
                <p className="font-medium">{bundle.transport.provider}</p>
                <p className="text-sm text-muted-foreground">
                  {getTransportModeLabel(bundle.transport.mode)} • {bundle.transport.classLabel} • {formatCurrency(bundle.transport.price, bundle.transport.currency)}
                </p>
              </div>
            </div>
          </>
        )}

        {/* VIP Package if present */}
        {bundle.vipPackage && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-amber-500">✨</span>
                <span>{isOfficialVIP ? 'Official VIP Package' : 'VIP-Style Extras'}</span>
              </div>
              <div className="pl-6">
                <p className="font-medium">{bundle.vipPackage.name}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {formatCurrency(bundle.vipPackage.price, bundle.vipPackage.currency)}
                </p>
                {bundle.vipPackage.inclusions.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {bundle.vipPackage.inclusions.slice(0, 3).map((inclusion, i) => (
                      <li key={i}>• {inclusion}</li>
                    ))}
                    {bundle.vipPackage.inclusions.length > 3 && (
                      <li className="italic">+ {bundle.vipPackage.inclusions.length - 3} more</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Purchase CTA with consent gate */}
        <PurchaseConsentGate>
          <div className="space-y-2">
            <Button className="w-full" variant="default">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Booking Options
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              You'll be directed to official ticket and hotel booking sites
            </p>
          </div>
        </PurchaseConsentGate>
      </CardContent>
    </Card>
  );
}
