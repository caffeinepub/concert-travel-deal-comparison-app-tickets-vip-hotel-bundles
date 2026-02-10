import type { TripBuilderState } from '@/pages/TripBuilderPage';
import type { Ticket, VIPPackage, Hotel, RoomType } from '@/backend';

export interface Bundle {
  ticket: Ticket;
  hotel: Hotel;
  roomType: RoomType;
  vipPackage?: VIPPackage;
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
              const totalCost = ticket.price + vipPackage.price + roomType.price * nights;
              bundles.push({
                ticket,
                hotel,
                roomType,
                vipPackage,
                totalCost,
                currency: ticket.currency,
                isOfficialVIP: true,
              });
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
          const totalCost = ticket.price + roomType.price * nights;
          bundles.push({
            ticket,
            hotel,
            roomType,
            totalCost,
            currency: ticket.currency,
            isOfficialVIP: false,
          });
        }
      }
    }
  }

  return bundles;
}
