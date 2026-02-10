import type { Bundle } from './localComparisonEngine';
import type { TicketType } from '@/backend';
import type { TransportOffer } from '@/components/offers/TransportOffersEditor';

export interface UpgradeAlternatives {
  tickets: Bundle[];
  transport: Bundle[];
  hotelRooms: Bundle[];
}

function getTicketQualityScore(type: TicketType): number {
  if ('vip' in (type as any)) return 2;
  if ('standard' in (type as any)) return 1;
  return 0;
}

function getTransportQualityScore(classLabel: string): number {
  const lower = classLabel.toLowerCase();
  if (lower.includes('first') || lower.includes('business')) return 3;
  if (lower.includes('premium') || lower.includes('plus')) return 2;
  if (lower.includes('economy') || lower.includes('standard')) return 1;
  return 1;
}

function getHotelRoomQualityScore(roomName: string, starRating?: number): number {
  const lower = roomName.toLowerCase();
  let score = starRating || 3;
  
  if (lower.includes('suite') || lower.includes('deluxe') || lower.includes('premium')) {
    score += 2;
  } else if (lower.includes('superior') || lower.includes('upgraded')) {
    score += 1;
  }
  
  return score;
}

export function detectUpgrades(
  baseline: Bundle,
  allBundles: Bundle[]
): UpgradeAlternatives {
  const upgrades: UpgradeAlternatives = {
    tickets: [],
    transport: [],
    hotelRooms: [],
  };

  const baseTicketQuality = getTicketQualityScore(baseline.ticket.type);
  const baseTransportQuality = baseline.transport ? getTransportQualityScore(baseline.transport.classLabel) : 0;
  const baseRoomQuality = getHotelRoomQualityScore(baseline.roomType.name, baseline.hotel.starRating);

  for (const bundle of allBundles) {
    // Skip the baseline itself
    if (
      bundle.ticket.id === baseline.ticket.id &&
      bundle.hotel.name === baseline.hotel.name &&
      bundle.roomType.name === baseline.roomType.name &&
      bundle.transport?.id === baseline.transport?.id
    ) {
      continue;
    }

    // Check for better ticket upgrades
    const ticketQuality = getTicketQualityScore(bundle.ticket.type);
    if (
      ticketQuality > baseTicketQuality &&
      bundle.ticket.price < baseline.ticket.price &&
      bundle.hotel.name === baseline.hotel.name &&
      bundle.roomType.name === baseline.roomType.name
    ) {
      upgrades.tickets.push(bundle);
    }

    // Check for better transport upgrades
    if (baseline.transport && bundle.transport) {
      const transportQuality = getTransportQualityScore(bundle.transport.classLabel);
      if (
        transportQuality > baseTransportQuality &&
        bundle.transport.price < baseline.transport.price &&
        bundle.ticket.id === baseline.ticket.id &&
        bundle.hotel.name === baseline.hotel.name &&
        bundle.roomType.name === baseline.roomType.name
      ) {
        upgrades.transport.push(bundle);
      }
    }

    // Check for better hotel room upgrades
    const roomQuality = getHotelRoomQualityScore(bundle.roomType.name, bundle.hotel.starRating);
    if (
      roomQuality > baseRoomQuality &&
      bundle.roomType.price < baseline.roomType.price &&
      bundle.ticket.id === baseline.ticket.id &&
      bundle.hotel.name === baseline.hotel.name
    ) {
      upgrades.hotelRooms.push(bundle);
    }
  }

  return upgrades;
}
