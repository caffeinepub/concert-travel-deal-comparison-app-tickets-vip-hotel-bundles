import type { TripBuilderState } from '@/pages/TripBuilderPage';
import type { Ticket, VIPPackage, Hotel, RoomType } from '@/backend';
import type { TransportOffer } from '@/components/offers/TransportOffersEditor';

export interface Bundle {
  ticket: Ticket;
  hotel: Hotel;
  roomType: RoomType;
  vipPackage?: VIPPackage;
  transport?: TransportOffer;
  totalCost: number;
  currency: string;
  isOfficialVIP: boolean;
}

export function generateBundles(tripData: TripBuilderState): Bundle[] {
  const bundles: Bundle[] = [];
  const nights = tripData.daysBefore + tripData.daysAfter + 1;

  // Generate bundles with official VIP packages if available
  if (tripData.vipPackages.length > 0) {
    for (const vipPackage of tripData.vipPackages) {
      for (const ticket of tripData.tickets) {
        for (const hotel of tripData.hotels) {
          for (const roomType of hotel.roomTypes) {
            // Only combine if currencies match
            if (ticket.currency === vipPackage.currency && ticket.currency === (hotel.prices?.currency || 'USD')) {
              // Without transport
              const totalCostNoTransport = ticket.price + vipPackage.price + roomType.price * nights;
              bundles.push({
                ticket,
                hotel,
                roomType,
                vipPackage,
                totalCost: totalCostNoTransport,
                currency: ticket.currency,
                isOfficialVIP: true,
              });

              // With transport options
              if (tripData.transportOffers.length > 0) {
                for (const transport of tripData.transportOffers) {
                  if (transport.currency === ticket.currency) {
                    const totalCostWithTransport = totalCostNoTransport + transport.price;
                    bundles.push({
                      ticket,
                      hotel,
                      roomType,
                      vipPackage,
                      transport,
                      totalCost: totalCostWithTransport,
                      currency: ticket.currency,
                      isOfficialVIP: true,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // Generate standard bundles (ticket + hotel, no VIP)
  for (const ticket of tripData.tickets) {
    for (const hotel of tripData.hotels) {
      for (const roomType of hotel.roomTypes) {
        // Only combine if currencies match
        if (ticket.currency === (hotel.prices?.currency || 'USD')) {
          // Without transport
          const totalCostNoTransport = ticket.price + roomType.price * nights;
          bundles.push({
            ticket,
            hotel,
            roomType,
            totalCost: totalCostNoTransport,
            currency: ticket.currency,
            isOfficialVIP: false,
          });

          // With transport options
          if (tripData.transportOffers.length > 0) {
            for (const transport of tripData.transportOffers) {
              if (transport.currency === ticket.currency) {
                const totalCostWithTransport = totalCostNoTransport + transport.price;
                bundles.push({
                  ticket,
                  hotel,
                  roomType,
                  transport,
                  totalCost: totalCostWithTransport,
                  currency: ticket.currency,
                  isOfficialVIP: false,
                });
              }
            }
          }
        }
      }
    }
  }

  return bundles;
}

export function findCheapestTransport(tripData: TripBuilderState, currency: string): TransportOffer | null {
  if (tripData.transportOffers.length === 0) return null;
  
  const matchingTransports = tripData.transportOffers.filter(t => t.currency === currency);
  if (matchingTransports.length === 0) return null;
  
  return matchingTransports.reduce((cheapest, current) => 
    current.price < cheapest.price ? current : cheapest
  );
}
