import { NextRequest, NextResponse } from 'next/server';
import { searchFlightsApify } from '@/lib/apify';
import type { CabinClass } from '@/types/flights';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate') ?? undefined;
  const adults = parseInt(searchParams.get('adults') ?? '1', 10);
  const cabinClass = (searchParams.get('cabinClass') ?? 'ECONOMY') as CabinClass;

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      { error: 'Missing required params: origin, destination, departureDate' },
      { status: 400 }
    );
  }

  try {
    const flights = await searchFlightsApify({ origin, destination, departureDate, returnDate, adults, cabinClass });
    return NextResponse.json({ flights }, { headers: { 'Cache-Control': 'public, s-maxage=120' } });
  } catch (err) {
    console.error('Flight search error:', err);
    return NextResponse.json({ error: 'Search failed', flights: [] }, { status: 500 });
  }
}
