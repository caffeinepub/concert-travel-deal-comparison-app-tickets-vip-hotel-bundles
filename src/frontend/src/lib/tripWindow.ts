export function calculateTravelWindow(
  concertDate: string,
  daysBefore: number,
  daysAfter: number
): { checkIn: bigint; checkOut: bigint } {
  const concert = new Date(concertDate);
  
  const checkIn = new Date(concert);
  checkIn.setDate(checkIn.getDate() - daysBefore);
  
  const checkOut = new Date(concert);
  checkOut.setDate(checkOut.getDate() + daysAfter + 1);
  
  return {
    checkIn: BigInt(checkIn.getTime() * 1_000_000),
    checkOut: BigInt(checkOut.getTime() * 1_000_000),
  };
}
