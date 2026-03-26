/**
 * Client-side flight search used when the API route is unavailable
 * (e.g. GitHub Pages static export). Returns realistic mock results.
 */
import type { Flight, SearchParams } from '@/types/flights';
import { buildAllSourceLinks } from './deepLinks';

const AIRLINES = [
  { code: 'BA',  name: 'British Airways',  source: 'google_flights'    },
  { code: 'EZY', name: 'easyJet',          source: 'skyscanner'         },
  { code: 'FR',  name: 'Ryanair',          source: 'skiplagged'         },
  { code: 'W6',  name: 'Wizz Air',         source: 'ita_matrix'         },
  { code: 'LS',  name: 'Jet2',             source: 'google_flights'     },
  { code: 'DY',  name: 'Norwegian',        source: 'skyscanner'         },
  { code: 'KL',  name: 'KLM',             source: 'ita_matrix'          },
  { code: 'VS',  name: 'Virgin Atlantic',  source: 'jacks_flight_club'  },
] as const;

const BASE_PRICES = [89, 115, 134, 158, 167, 189, 210, 239];

export function searchFlightsClient(params: SearchParams): Flight[] {
  const sourceLinks = buildAllSourceLinks(params);

  return BASE_PRICES.map((price, i): Flight => {
    const airline = AIRLINES[i];
    const depHour = 6 + i * 2;
    const durationH = 1 + Math.floor(i * 0.8);
    const durationM = (i * 20) % 60;
    const arrHour = depHour + durationH;

    return {
      id: `client-${i}`,
      outbound: [
        {
          departureAirport: params.origin === 'LON' ? 'LHR' : params.origin,
          arrivalAirport: params.destination,
          departureTime: `${params.departureDate}T${String(depHour).padStart(2, '0')}:00:00`,
          arrivalTime: `${params.departureDate}T${String(arrHour).padStart(2, '0')}:${String(durationM).padStart(2, '0')}:00`,
          airline: airline.code,
          airlineCode: airline.code,
          flightNumber: `${airline.code}${101 + i * 7}`,
          duration: `${durationH}h${durationM > 0 ? ` ${durationM}m` : ''}`,
        },
      ],
      totalDuration: `${durationH}h${durationM > 0 ? ` ${durationM}m` : ''}`,
      stops: i > 5 ? 1 : 0,
      price,
      currency: 'GBP',
      dealScore: i === 0 ? 'great' : i < 3 ? 'good' : 'normal',
      sourceLinks,
      airline: airline.name,
      airlineCode: airline.code,
      primarySource: airline.source,
    };
  });
}
