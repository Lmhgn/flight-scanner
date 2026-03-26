export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  flag: string;
}

export type LondonAirport = 'LHR' | 'LGW' | 'STN' | 'LTN' | 'LCY';

export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export type DealScore = 'great' | 'good' | 'normal';

export type FlightSource =
  | 'google_flights'
  | 'ita_matrix'
  | 'skyscanner'
  | 'skiplagged'
  | 'jacks_flight_club';

export interface SourceLink {
  source: FlightSource;
  label: string;
  url: string;
  price?: number;
  color: string;
  bgColor: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabinClass: CabinClass;
}

export interface FlightSegment {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  duration: string;
}

export interface Flight {
  id: string;
  outbound: FlightSegment[];
  inbound?: FlightSegment[];
  totalDuration: string;
  stops: number;
  price: number;
  currency: string;
  dealScore: DealScore;
  sourceLinks: SourceLink[];
  airline: string;
  airlineCode: string;
}

export type DestinationCategory =
  | 'european-city'
  | 'beach-med'
  | 'beach-canaries'
  | 'transatlantic'
  | 'middle-east'
  | 'long-haul-asia'
  | 'long-haul-other';

export interface Deal {
  id: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate?: string;
  nights?: number;
  price: number;
  originalPrice: number;
  savingsPercent: number;
  currency: string;
  airline: string;
  dealScore: DealScore;
  dealType: string;
  month: string; // 'YYYY-MM'
  sourceLinks: SourceLink[];
  category: DestinationCategory;
  departureAirport: LondonAirport;
  tags: string[];
}
