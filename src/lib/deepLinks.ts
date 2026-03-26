import type { FlightSource, SearchParams, SourceLink } from '@/types/flights';
import { format } from 'date-fns';

function skyscannerDate(dateStr: string): string {
  // YYMMDD format
  return format(new Date(dateStr), 'yyMMdd');
}

export function buildGoogleFlightsUrl(params: SearchParams): string {
  const q = `flights from ${params.origin} to ${params.destination} on ${params.departureDate}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}&hl=en-GB&curr=GBP`;
}

export function buildSkyscannerUrl(params: SearchParams): string {
  const dep = skyscannerDate(params.departureDate);
  const originCode = params.origin.toLowerCase();
  const destCode = params.destination.toLowerCase();
  if (params.returnDate) {
    const ret = skyscannerDate(params.returnDate);
    return `https://www.skyscanner.net/transport/flights/${originCode}/${destCode}/${dep}/${ret}/`;
  }
  return `https://www.skyscanner.net/transport/flights/${originCode}/${destCode}/${dep}/`;
}

export function buildSkiplaggerUrl(params: SearchParams): string {
  if (params.returnDate) {
    return `https://skiplagged.com/flights/${params.origin}/${params.destination}/${params.departureDate}/${params.returnDate}`;
  }
  return `https://skiplagged.com/flights/${params.origin}/${params.destination}/${params.departureDate}`;
}

export function buildItaMatrixUrl(_params: SearchParams): string {
  // ITA Matrix has no deep link support — link to homepage
  return 'https://matrix.itasoftware.com/';
}

export function buildJacksFlightClubUrl(_params: SearchParams): string {
  return 'https://www.jacksflight.club/deals';
}

export const SOURCE_META: Record<
  FlightSource,
  { label: string; color: string; bgColor: string; shortLabel: string }
> = {
  google_flights: {
    label: 'Google Flights',
    shortLabel: 'Google',
    color: '#4285F4',
    bgColor: 'rgba(66,133,244,0.12)',
  },
  ita_matrix: {
    label: 'ITA Matrix',
    shortLabel: 'ITA',
    color: '#34A853',
    bgColor: 'rgba(52,168,83,0.12)',
  },
  skyscanner: {
    label: 'Skyscanner',
    shortLabel: 'Skyscanner',
    color: '#00A698',
    bgColor: 'rgba(0,166,152,0.12)',
  },
  skiplagged: {
    label: 'Skiplagged',
    shortLabel: 'Skiplagged',
    color: '#FF6B35',
    bgColor: 'rgba(255,107,53,0.12)',
  },
  jacks_flight_club: {
    label: "Jack's Flight Club",
    shortLabel: "Jack's",
    color: '#E63946',
    bgColor: 'rgba(230,57,70,0.12)',
  },
};

export function buildAllSourceLinks(params: SearchParams, prices?: Partial<Record<FlightSource, number>>): SourceLink[] {
  const builders: Record<FlightSource, (p: SearchParams) => string> = {
    google_flights: buildGoogleFlightsUrl,
    ita_matrix: buildItaMatrixUrl,
    skyscanner: buildSkyscannerUrl,
    skiplagged: buildSkiplaggerUrl,
    jacks_flight_club: buildJacksFlightClubUrl,
  };

  return (Object.keys(SOURCE_META) as FlightSource[]).map((source) => ({
    source,
    label: SOURCE_META[source].label,
    url: builders[source](params),
    price: prices?.[source],
    color: SOURCE_META[source].color,
    bgColor: SOURCE_META[source].bgColor,
  }));
}
