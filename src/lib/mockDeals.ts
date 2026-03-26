import { addDays, format } from 'date-fns';
import type { Deal, LondonAirport, DestinationCategory } from '@/types/flights';
import { buildAllSourceLinks } from './deepLinks';
import { LONDON_AIRPORTS, POPULAR_AIRPORTS } from './airports';

function findDest(code: string) {
  return POPULAR_AIRPORTS.find((a) => a.code === code)!;
}

function monthStr(offset: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return format(d, 'yyyy-MM');
}

function datesInMonth(monthOffset: number, dayOfMonth: number): { dep: string; ret: string } {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  d.setDate(dayOfMonth);
  const dep = format(d, 'yyyy-MM-dd');
  const ret = format(addDays(d, 7), 'yyyy-MM-dd');
  return { dep, ret };
}

const DESTINATION_IMAGES: Record<string, string> = {
  DUB: 'https://images.unsplash.com/photo-1548662880791-b5b07b1a1ee3?auto=format&fit=crop&w=600&q=80',
  AMS: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=600&q=80',
  KRK: 'https://images.unsplash.com/photo-1547435009-49bfe2da9d30?auto=format&fit=crop&w=600&q=80',
  LIS: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80',
  BCN: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80',
  PRG: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80',
  MAD: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80',
  AGP: 'https://images.unsplash.com/photo-1575548782819-db6a98e8dad5?auto=format&fit=crop&w=600&q=80',
  DXB: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
  JFK: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
  ATH: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=600&q=80',
  PMI: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
  FAO: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80',
  TFS: 'https://images.unsplash.com/photo-1569154851647-f86c0d3a4d65?auto=format&fit=crop&w=600&q=80',
  BKK: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
  NRT: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
  MIA: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  SIN: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
  DPS: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
  CUN: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=600&q=80',
  BUD: 'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&w=600&q=80',
  FCO: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
};

interface RawDeal {
  destCode: string;
  price: number;
  originalPrice: number;
  airline: string;
  dealType: string;
  monthOffset: number;
  dayOfMonth: number;
  departureAirport: LondonAirport;
  category: DestinationCategory;
  tags: string[];
  nights: number;
  flightDuration: string;
  directFlight: boolean;
}

const RAW_DEALS: RawDeal[] = [
  // === This Month (offset 0) ===
  {
    destCode: 'DUB', price: 29, originalPrice: 89, airline: 'Ryanair',
    dealType: 'Flash Sale', monthOffset: 0, dayOfMonth: 28,
    departureAirport: 'STN', category: 'european-city',
    tags: ['Last minute', 'No bags needed'], nights: 3,
    flightDuration: '1h 25m', directFlight: true,
  },
  {
    destCode: 'AMS', price: 38, originalPrice: 115, airline: 'easyJet',
    dealType: 'Flash Sale', monthOffset: 0, dayOfMonth: 29,
    departureAirport: 'LTN', category: 'european-city',
    tags: ['Weekend trip', 'Flash sale'], nights: 3,
    flightDuration: '1h 15m', directFlight: true,
  },
  {
    destCode: 'KRK', price: 31, originalPrice: 99, airline: 'Wizz Air',
    dealType: "Jack's Find", monthOffset: 0, dayOfMonth: 28,
    departureAirport: 'LTN', category: 'european-city',
    tags: ["Jack's Flight Club", 'Hidden gem'], nights: 4,
    flightDuration: '2h 30m', directFlight: true,
  },

  // === Next Month (offset 1) ===
  {
    destCode: 'LIS', price: 58, originalPrice: 189, airline: 'TAP Air Portugal',
    dealType: 'Error Fare', monthOffset: 1, dayOfMonth: 5,
    departureAirport: 'LHR', category: 'european-city',
    tags: ['Error fare', 'Book fast'], nights: 7,
    flightDuration: '2h 30m', directFlight: true,
  },
  {
    destCode: 'BCN', price: 45, originalPrice: 132, airline: 'Vueling',
    dealType: 'Sale', monthOffset: 1, dayOfMonth: 8,
    departureAirport: 'LGW', category: 'european-city',
    tags: ['Spring sale', 'Direct'], nights: 4,
    flightDuration: '2h 10m', directFlight: true,
  },
  {
    destCode: 'PRG', price: 39, originalPrice: 121, airline: 'Wizz Air',
    dealType: 'Flash Sale', monthOffset: 1, dayOfMonth: 11,
    departureAirport: 'STN', category: 'european-city',
    tags: ['Weekend getaway', 'Budget pick'], nights: 3,
    flightDuration: '2h 00m', directFlight: true,
  },
  {
    destCode: 'MAD', price: 47, originalPrice: 138, airline: 'Iberia Express',
    dealType: 'Sale', monthOffset: 1, dayOfMonth: 14,
    departureAirport: 'LHR', category: 'european-city',
    tags: ['Direct', 'Spring break'], nights: 5,
    flightDuration: '2h 20m', directFlight: true,
  },
  {
    destCode: 'AGP', price: 52, originalPrice: 145, airline: 'easyJet',
    dealType: 'Flash Sale', monthOffset: 1, dayOfMonth: 10,
    departureAirport: 'LGW', category: 'beach-med',
    tags: ['Beach deal', 'Spring sun'], nights: 7,
    flightDuration: '2h 45m', directFlight: true,
  },
  {
    destCode: 'DXB', price: 189, originalPrice: 520, airline: 'Emirates',
    dealType: "Jack's Find", monthOffset: 1, dayOfMonth: 6,
    departureAirport: 'LHR', category: 'middle-east',
    tags: ["Jack's Flight Club", 'Long weekend'], nights: 4,
    flightDuration: '7h 20m', directFlight: true,
  },
  {
    destCode: 'JFK', price: 219, originalPrice: 680, airline: 'British Airways',
    dealType: 'Error Fare', monthOffset: 1, dayOfMonth: 9,
    departureAirport: 'LHR', category: 'transatlantic',
    tags: ['Error fare', 'Incredible value'], nights: 7,
    flightDuration: '7h 30m', directFlight: true,
  },
  {
    destCode: 'BUD', price: 41, originalPrice: 124, airline: 'Ryanair',
    dealType: 'Flash Sale', monthOffset: 1, dayOfMonth: 18,
    departureAirport: 'STN', category: 'european-city',
    tags: ['Weekend trip', 'Cheap eats'], nights: 3,
    flightDuration: '2h 25m', directFlight: true,
  },
  {
    destCode: 'FCO', price: 55, originalPrice: 165, airline: 'easyJet',
    dealType: 'Sale', monthOffset: 1, dayOfMonth: 21,
    departureAirport: 'LGW', category: 'european-city',
    tags: ['Easter break', 'Culture trip'], nights: 5,
    flightDuration: '2h 45m', directFlight: true,
  },

  // === Month After Next (offset 2) ===
  {
    destCode: 'ATH', price: 67, originalPrice: 198, airline: 'easyJet',
    dealType: 'Early Bird', monthOffset: 2, dayOfMonth: 4,
    departureAirport: 'LGW', category: 'european-city',
    tags: ['Early bird', 'Summer preview'], nights: 7,
    flightDuration: '3h 40m', directFlight: true,
  },
  {
    destCode: 'PMI', price: 61, originalPrice: 175, airline: 'Jet2',
    dealType: 'Sale', monthOffset: 2, dayOfMonth: 8,
    departureAirport: 'LGW', category: 'beach-med',
    tags: ['Summer sun', 'Mediterranean'], nights: 7,
    flightDuration: '2h 20m', directFlight: true,
  },
  {
    destCode: 'FAO', price: 64, originalPrice: 182, airline: 'easyJet',
    dealType: 'Early Bird', monthOffset: 2, dayOfMonth: 12,
    departureAirport: 'LTN', category: 'beach-med',
    tags: ['Algarve', 'Summer saver'], nights: 7,
    flightDuration: '2h 35m', directFlight: true,
  },
  {
    destCode: 'TFS', price: 88, originalPrice: 248, airline: 'Jet2',
    dealType: 'Flash Sale', monthOffset: 2, dayOfMonth: 16,
    departureAirport: 'LGW', category: 'beach-canaries',
    tags: ['Canaries', 'Guaranteed sun'], nights: 7,
    flightDuration: '4h 15m', directFlight: true,
  },
  {
    destCode: 'BKK', price: 348, originalPrice: 950, airline: 'Qatar Airways',
    dealType: "Jack's Find", monthOffset: 2, dayOfMonth: 5,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ["Jack's Flight Club", 'Southeast Asia'], nights: 14,
    flightDuration: '11h 45m', directFlight: false,
  },
  {
    destCode: 'NRT', price: 412, originalPrice: 1100, airline: 'Japan Airlines',
    dealType: 'Error Fare', monthOffset: 2, dayOfMonth: 9,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ['Error fare', 'Japan'], nights: 10,
    flightDuration: '13h 20m', directFlight: false,
  },
  {
    destCode: 'MIA', price: 289, originalPrice: 750, airline: 'Virgin Atlantic',
    dealType: 'Flash Sale', monthOffset: 2, dayOfMonth: 14,
    departureAirport: 'LHR', category: 'transatlantic',
    tags: ['Miami', 'Summer getaway'], nights: 10,
    flightDuration: '10h 10m', directFlight: true,
  },
  {
    destCode: 'SIN', price: 368, originalPrice: 890, airline: 'Singapore Airlines',
    dealType: 'Sale', monthOffset: 2, dayOfMonth: 19,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ['Singapore', 'Asia stopover'], nights: 10,
    flightDuration: '13h 00m', directFlight: true,
  },
  {
    destCode: 'DPS', price: 425, originalPrice: 1100, airline: 'KLM',
    dealType: 'Sale', monthOffset: 2, dayOfMonth: 22,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ['Bali', 'Dream holiday'], nights: 14,
    flightDuration: '15h 30m', directFlight: false,
  },
  {
    destCode: 'CUN', price: 318, originalPrice: 830, airline: 'TUI Airways',
    dealType: 'Flash Sale', monthOffset: 2, dayOfMonth: 15,
    departureAirport: 'LGW', category: 'transatlantic',
    tags: ['Cancun', 'All-inclusive'], nights: 10,
    flightDuration: '10h 00m', directFlight: false,
  },
];

export function getMockDeals(): Deal[] {
  return RAW_DEALS.map((raw, idx): Deal => {
    const destination = findDest(raw.destCode);
    const origin = { ...LONDON_AIRPORTS[raw.departureAirport] };
    const { dep, ret } = datesInMonth(raw.monthOffset, raw.dayOfMonth);
    const savingsPercent = Math.round((1 - raw.price / raw.originalPrice) * 100);

    const searchParams = {
      origin: raw.departureAirport,
      destination: raw.destCode,
      departureDate: dep,
      returnDate: ret,
      adults: 1,
      cabinClass: 'ECONOMY' as const,
    };

    const dealScore =
      savingsPercent >= 45 ? 'great' : savingsPercent >= 25 ? 'good' : 'normal';

    return {
      id: `mock-${idx}`,
      origin,
      destination,
      departureDate: dep,
      returnDate: ret,
      nights: raw.nights,
      price: raw.price,
      originalPrice: raw.originalPrice,
      savingsPercent,
      currency: 'GBP',
      airline: raw.airline,
      dealScore,
      dealType: raw.dealType,
      month: monthStr(raw.monthOffset),
      sourceLinks: buildAllSourceLinks(searchParams),
      category: raw.category,
      departureAirport: raw.departureAirport,
      tags: raw.tags,
      imageUrl: DESTINATION_IMAGES[raw.destCode] ?? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
      flightDuration: raw.flightDuration,
      directFlight: raw.directFlight,
      countryCode: destination?.country?.slice(0, 2).toUpperCase(),
    };
  });
}
