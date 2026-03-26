import type { Flight, FlightSegment, DealScore } from '@/types/flights';
import type { SearchParams } from '@/types/flights';
import { buildAllSourceLinks } from './deepLinks';

const SANDBOX_BASE = 'https://test.api.amadeus.com';
const PROD_BASE = 'https://api.amadeus.com';

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

function getBaseUrl(): string {
  return process.env.AMADEUS_ENV === 'production' ? PROD_BASE : SANDBOX_BASE;
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.token;
  }

  const base = getBaseUrl();
  const res = await fetch(`${base}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_CLIENT_ID ?? '',
      client_secret: process.env.AMADEUS_CLIENT_SECRET ?? '',
    }),
  });

  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);
  const data = await res.json();

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.token;
}

function parseDuration(iso: string): number {
  // PT2H30M -> 150 minutes
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] ?? '0') * 60) + parseInt(match[2] ?? '0');
}

function formatDuration(iso: string): string {
  const mins = parseDuration(iso);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSegment(seg: any): FlightSegment {
  return {
    departureAirport: seg.departure.iataCode,
    arrivalAirport: seg.arrival.iataCode,
    departureTime: seg.departure.at,
    arrivalTime: seg.arrival.at,
    airline: seg.carrierCode,
    airlineCode: seg.carrierCode,
    flightNumber: `${seg.carrierCode}${seg.number}`,
    duration: formatDuration(seg.duration),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scoreOffer(offer: any, allPrices: number[]): DealScore {
  const price = parseFloat(offer.price.grandTotal);
  const avg = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
  const ratio = price / avg;
  if (ratio < 0.75) return 'great';
  if (ratio < 0.90) return 'good';
  return 'normal';
}

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return getMockSearchResults(params);
  }

  try {
    const token = await getAccessToken();
    const base = getBaseUrl();

    const qs = new URLSearchParams({
      originLocationCode: params.origin === 'LON' ? 'LON' : params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: String(params.adults),
      currencyCode: 'GBP',
      max: '15',
    });
    if (params.returnDate) qs.set('returnDate', params.returnDate);
    if (params.cabinClass) qs.set('travelClass', params.cabinClass);

    const res = await fetch(`${base}/v2/shopping/flight-offers?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`Amadeus search failed: ${res.status}`);
    const data = await res.json();

    const offers = data.data ?? [];
    const allPrices: number[] = offers.map((o: { price: { grandTotal: string } }) => parseFloat(o.price.grandTotal));

    const sourceLinks = buildAllSourceLinks(params);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return offers.map((offer: any): Flight => {
      const outboundItinerary = offer.itineraries[0];
      const inboundItinerary = offer.itineraries[1];
      const segments = outboundItinerary.segments;
      const firstSeg = segments[0];

      return {
        id: offer.id,
        outbound: segments.map(parseSegment),
        inbound: inboundItinerary ? inboundItinerary.segments.map(parseSegment) : undefined,
        totalDuration: formatDuration(outboundItinerary.duration),
        stops: segments.length - 1,
        price: parseFloat(offer.price.grandTotal),
        currency: 'GBP',
        dealScore: scoreOffer(offer, allPrices),
        sourceLinks,
        airline: firstSeg.carrierCode,
        airlineCode: firstSeg.carrierCode,
      };
    });
  } catch (err) {
    console.error('Amadeus error, falling back to mock:', err);
    return getMockSearchResults(params);
  }
}

function getMockSearchResults(params: SearchParams): Flight[] {
  const sourceLinks = buildAllSourceLinks(params);
  const basePrices = [89, 115, 134, 158, 167, 189, 210, 239];

  return basePrices.map((price, i): Flight => ({
    id: `mock-search-${i}`,
    outbound: [
      {
        departureAirport: params.origin,
        arrivalAirport: params.destination,
        departureTime: `${params.departureDate}T${String(6 + i * 2).padStart(2, '0')}:00:00`,
        arrivalTime: `${params.departureDate}T${String(8 + i * 2).padStart(2, '0')}:30:00`,
        airline: ['BA', 'EZY', 'FR', 'U2', 'W6', 'LS', 'DY', 'KL'][i],
        airlineCode: ['BA', 'EZY', 'FR', 'U2', 'W6', 'LS', 'DY', 'KL'][i],
        flightNumber: `${['BA', 'EZY', 'FR', 'U2', 'W6', 'LS', 'DY', 'KL'][i]}${100 + i * 7}`,
        duration: `${1 + i}h ${(i * 15) % 60}m`,
      },
    ],
    totalDuration: `${1 + i}h ${(i * 15) % 60}m`,
    stops: i > 5 ? 1 : 0,
    price,
    currency: 'GBP',
    dealScore: i === 0 ? 'great' : i < 3 ? 'good' : 'normal',
    sourceLinks,
    airline: ['British Airways', 'easyJet', 'Ryanair', 'easyJet', 'Wizz Air', 'Jet2', 'Norwegian', 'KLM'][i],
    airlineCode: ['BA', 'EZY', 'FR', 'U2', 'W6', 'LS', 'DY', 'KL'][i],
  }));
}
