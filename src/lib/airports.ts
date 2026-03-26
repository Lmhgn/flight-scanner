import type { Airport, LondonAirport } from '@/types/flights';

export const LONDON_AIRPORTS: Record<LondonAirport, Airport> = {
  LHR: { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  LGW: { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  STN: { code: 'STN', name: 'London Stansted', city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  LTN: { code: 'LTN', name: 'London Luton', city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  LCY: { code: 'LCY', name: 'London City', city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
};

export const ALL_LONDON_AIRPORTS_OPTION = {
  code: 'LON',
  name: 'All London Airports',
  city: 'London',
  country: 'United Kingdom',
  flag: '🇬🇧',
};

export const POPULAR_AIRPORTS: Airport[] = [
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France', flag: '🇫🇷' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { code: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { code: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain', flag: '🇪🇸' },
  { code: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'Italy', flag: '🇮🇹' },
  { code: 'LIS', name: 'Lisbon Humberto Delgado', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹' },
  { code: 'PRG', name: 'Prague Vaclav Havel', city: 'Prague', country: 'Czech Republic', flag: '🇨🇿' },
  { code: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'Hungary', flag: '🇭🇺' },
  { code: 'KRK', name: 'Krakow John Paul II', city: 'Krakow', country: 'Poland', flag: '🇵🇱' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Ireland', flag: '🇮🇪' },
  { code: 'ATH', name: 'Athens Eleftherios Venizelos', city: 'Athens', country: 'Greece', flag: '🇬🇷' },
  { code: 'PMI', name: 'Palma de Mallorca', city: 'Palma', country: 'Spain', flag: '🇪🇸' },
  { code: 'FAO', name: 'Faro', city: 'Faro', country: 'Portugal', flag: '🇵🇹' },
  { code: 'AGP', name: 'Malaga Costa del Sol', city: 'Malaga', country: 'Spain', flag: '🇪🇸' },
  { code: 'TFS', name: 'Tenerife South', city: 'Tenerife', country: 'Spain', flag: '🇪🇸' },
  { code: 'LPA', name: 'Gran Canaria', city: 'Gran Canaria', country: 'Spain', flag: '🇪🇸' },
  { code: 'JFK', name: 'New York JFK', city: 'New York', country: 'USA', flag: '🇺🇸' },
  { code: 'EWR', name: 'New York Newark', city: 'New York', country: 'USA', flag: '🇺🇸' },
  { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
  { code: 'MIA', name: 'Miami', city: 'Miami', country: 'USA', flag: '🇺🇸' },
  { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { code: 'BKK', name: 'Bangkok Suvarnabhumi', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { code: 'HKT', name: 'Phuket', city: 'Phuket', country: 'Thailand', flag: '🇹🇭' },
  { code: 'NRT', name: 'Tokyo Narita', city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { code: 'DPS', name: 'Bali Ngurah Rai', city: 'Bali', country: 'Indonesia', flag: '🇮🇩' },
  { code: 'CUN', name: 'Cancun', city: 'Cancun', country: 'Mexico', flag: '🇲🇽' },
  { code: 'GRU', name: 'Sao Paulo Guarulhos', city: 'Sao Paulo', country: 'Brazil', flag: '🇧🇷' },
  { code: 'ORD', name: 'Chicago O\'Hare', city: 'Chicago', country: 'USA', flag: '🇺🇸' },
];

export function findAirport(query: string): Airport | undefined {
  const q = query.toUpperCase();
  return POPULAR_AIRPORTS.find(
    (a) => a.code === q || a.city.toUpperCase().includes(q) || a.name.toUpperCase().includes(q)
  );
}

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return POPULAR_AIRPORTS.slice(0, 8);
  const q = query.toUpperCase();
  return POPULAR_AIRPORTS.filter(
    (a) =>
      a.code.includes(q) ||
      a.city.toUpperCase().includes(q) ||
      a.name.toUpperCase().includes(q) ||
      a.country.toUpperCase().includes(q)
  ).slice(0, 8);
}
