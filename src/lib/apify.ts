import type { Flight, FlightSource, SearchParams, SourceLink } from '@/types/flights';
import { buildAllSourceLinks } from './deepLinks';
import { searchFlightsClient } from './clientSearch';

interface ApifySegment {
  airline?: string;
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departTime?: string;
  arriveTime?: string;
  duration?: string;
}

interface ApifyFlight {
  bestPrice: number;
  cheapestSource?: string;
  prices?: Record<string, number>;
  links?: Record<string, string>;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  from: { iata: string; city?: string };
  to: { iata: string; city?: string };
  segments?: ApifySegment[];
}

// Map Apify source names to our FlightSource enum
const SOURCE_MAP: Record<string, FlightSource> = {
  google_flights: 'google_flights',
  kiwi: 'skyscanner',
  skyscanner: 'skyscanner',
  ryanair: 'skyscanner',
  easyjet: 'skyscanner',
  wizz_air: 'skyscanner',
  wizzair: 'skyscanner',
  norwegian: 'skyscanner',
  travelpayouts: 'ita_matrix',
};

// Derive IATA airline code from flight number string (e.g. "FR1234" → "FR")
function airlineCodeFromFlightNum(flightNum?: string): string {
  return flightNum?.match(/^([A-Z]{2,3})\d/)?.[1] ?? '';
}

const AIRLINE_NAMES: Record<string, string> = {
  BA: 'British Airways', EZY: 'easyJet', U2: 'easyJet', FR: 'Ryanair',
  W6: 'Wizz Air', LS: 'Jet2', DY: 'Norwegian', KL: 'KLM',
  EK: 'Emirates', VS: 'Virgin Atlantic', IB: 'Iberia', TP: 'TAP Portugal',
  VY: 'Vueling', AF: 'Air France', LH: 'Lufthansa', AZ: 'ITA Airways',
};

function mapToFlight(item: ApifyFlight, index: number, params: SearchParams): Flight {
  const primarySrc: FlightSource = SOURCE_MAP[item.cheapestSource ?? ''] ?? 'google_flights';

  // Deal score: compare best price to max across sources
  const sourcePrices = Object.values(item.prices ?? {}).filter((p): p is number => typeof p === 'number');
  const maxPrice = sourcePrices.length > 1 ? Math.max(...sourcePrices) : item.bestPrice * 1.35;
  const savings = maxPrice > 0 ? (maxPrice - item.bestPrice) / maxPrice : 0;
  const dealScore = savings > 0.28 ? 'great' : savings > 0.12 ? 'good' : 'normal';

  // Build source links: use real Apify booking URLs where available, deep links as fallback
  const baseLinks = buildAllSourceLinks(params);
  const sourceLinks: SourceLink[] = baseLinks.map((link) => ({
    ...link,
    url: item.links?.[link.source] ?? item.links?.[item.cheapestSource ?? ''] ?? link.url,
    price: item.prices?.[link.source] ?? undefined,
  }));

  const seg = item.segments?.[0];
  const airlineCode = airlineCodeFromFlightNum(seg?.flightNumber) || primarySrc.slice(0, 2).toUpperCase();
  const airline = seg?.airline ?? AIRLINE_NAMES[airlineCode] ?? item.cheapestSource ?? 'Unknown';

  return {
    id: `apify-${index}`,
    outbound: [{
      departureAirport: item.from.iata,
      arrivalAirport: item.to.iata,
      departureTime: item.departTime,
      arrivalTime: item.arriveTime,
      airline: airlineCode,
      airlineCode,
      flightNumber: seg?.flightNumber ?? `${airlineCode}${100 + index}`,
      duration: item.duration,
    }],
    totalDuration: item.duration,
    stops: item.stops,
    price: item.bestPrice,
    currency: 'GBP',
    dealScore,
    sourceLinks,
    airline,
    airlineCode,
    primarySource: primarySrc,
  };
}

export async function searchFlightsApify(params: SearchParams): Promise<Flight[]> {
  const apiKey = process.env.APIFY_API_KEY;
  if (!apiKey) {
    console.log('[apify] No APIFY_API_KEY — using mock data');
    return searchFlightsClient(params);
  }

  const origin = params.origin === 'LON' ? 'LHR' : params.origin;
  const destination = params.destination;

  const body = {
    origin,
    destination,
    departDate: params.departureDate,
    ...(params.returnDate && { returnDate: params.returnDate }),
    adults: params.adults ?? 1,
    cabinClass: params.cabinClass ?? 'ECONOMY',
    currency: 'GBP',
    maxFlights: 10,
  };

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/makework36~flight-price-scraper/run-sync-get-dataset-items?token=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
      }
    );

    if (!res.ok) {
      console.error('[apify] HTTP', res.status);
      return searchFlightsClient(params);
    }

    const items: ApifyFlight[] = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      console.warn('[apify] Empty response — falling back to mock');
      return searchFlightsClient(params);
    }

    return items.map((item, i) => mapToFlight(item, i, params));
  } catch (err) {
    console.error('[apify] Request failed:', err);
    return searchFlightsClient(params);
  }
}
