import { addDays, format } from 'date-fns';
import type { Deal, LondonAirport, DestinationCategory } from '@/types/flights';
import { buildAllSourceLinks } from './deepLinks';
import { LONDON_AIRPORTS, POPULAR_AIRPORTS } from './airports';

function findDest(code: string) {
  return POPULAR_AIRPORTS.find((a) => a.code === code)!;
}

// Reference date: use today dynamically so deals are always current
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
}

const RAW_DEALS: RawDeal[] = [
  // === This Month (offset 0) ===
  {
    destCode: 'DUB', price: 29, originalPrice: 89, airline: 'Ryanair',
    dealType: 'Flash Sale', monthOffset: 0, dayOfMonth: 28,
    departureAirport: 'STN', category: 'european-city',
    tags: ['Last minute', 'No bags needed'], nights: 3,
  },
  {
    destCode: 'AMS', price: 38, originalPrice: 115, airline: 'easyJet',
    dealType: 'Flash Sale', monthOffset: 0, dayOfMonth: 29,
    departureAirport: 'LTN', category: 'european-city',
    tags: ['Weekend trip', 'Flash sale'], nights: 3,
  },
  {
    destCode: 'KRK', price: 31, originalPrice: 99, airline: 'Wizz Air',
    dealType: "Jack's Find", monthOffset: 0, dayOfMonth: 28,
    departureAirport: 'LTN', category: 'european-city',
    tags: ["Jack's Flight Club", 'Hidden gem'], nights: 4,
  },

  // === Next Month (offset 1) ===
  {
    destCode: 'LIS', price: 58, originalPrice: 189, airline: 'TAP Air Portugal',
    dealType: 'Error Fare', monthOffset: 1, dayOfMonth: 5,
    departureAirport: 'LHR', category: 'european-city',
    tags: ['Error fare', 'Book fast'], nights: 7,
  },
  {
    destCode: 'BCN', price: 45, originalPrice: 132, airline: 'Vueling',
    dealType: 'Sale', monthOffset: 1, dayOfMonth: 8,
    departureAirport: 'LGW', category: 'european-city',
    tags: ['Spring sale', 'Direct'], nights: 4,
  },
  {
    destCode: 'PRG', price: 39, originalPrice: 121, airline: 'Wizz Air',
    dealType: 'Flash Sale', monthOffset: 1, dayOfMonth: 11,
    departureAirport: 'STN', category: 'european-city',
    tags: ['Weekend getaway', 'Budget pick'], nights: 3,
  },
  {
    destCode: 'MAD', price: 47, originalPrice: 138, airline: 'Iberia Express',
    dealType: 'Sale', monthOffset: 1, dayOfMonth: 14,
    departureAirport: 'LHR', category: 'european-city',
    tags: ['Direct', 'Spring break'], nights: 5,
  },
  {
    destCode: 'AGP', price: 52, originalPrice: 145, airline: 'easyJet',
    dealType: 'Flash Sale', monthOffset: 1, dayOfMonth: 10,
    departureAirport: 'LGW', category: 'beach-med',
    tags: ['Beach deal', 'Spring sun'], nights: 7,
  },
  {
    destCode: 'DXB', price: 189, originalPrice: 520, airline: 'Emirates',
    dealType: "Jack's Find", monthOffset: 1, dayOfMonth: 6,
    departureAirport: 'LHR', category: 'middle-east',
    tags: ["Jack's Flight Club", 'Long weekend'], nights: 4,
  },
  {
    destCode: 'JFK', price: 219, originalPrice: 680, airline: 'British Airways',
    dealType: 'Error Fare', monthOffset: 1, dayOfMonth: 9,
    departureAirport: 'LHR', category: 'transatlantic',
    tags: ['Error fare', 'Incredible value'], nights: 7,
  },
  {
    destCode: 'BUD', price: 41, originalPrice: 124, airline: 'Ryanair',
    dealType: 'Flash Sale', monthOffset: 1, dayOfMonth: 18,
    departureAirport: 'STN', category: 'european-city',
    tags: ['Weekend trip', 'Cheap eats'], nights: 3,
  },
  {
    destCode: 'FCO', price: 55, originalPrice: 165, airline: 'easyJet',
    dealType: 'Sale', monthOffset: 1, dayOfMonth: 21,
    departureAirport: 'LGW', category: 'european-city',
    tags: ['Easter break', 'Culture trip'], nights: 5,
  },

  // === Month After Next (offset 2) ===
  {
    destCode: 'ATH', price: 67, originalPrice: 198, airline: 'easyJet',
    dealType: 'Early Bird', monthOffset: 2, dayOfMonth: 4,
    departureAirport: 'LGW', category: 'european-city',
    tags: ['Early bird', 'Summer preview'], nights: 7,
  },
  {
    destCode: 'PMI', price: 61, originalPrice: 175, airline: 'Jet2',
    dealType: 'Sale', monthOffset: 2, dayOfMonth: 8,
    departureAirport: 'LGW', category: 'beach-med',
    tags: ['Summer sun', 'All-inclusive nearby'], nights: 7,
  },
  {
    destCode: 'FAO', price: 64, originalPrice: 182, airline: 'easyJet',
    dealType: 'Early Bird', monthOffset: 2, dayOfMonth: 12,
    departureAirport: 'LTN', category: 'beach-med',
    tags: ['Algarve', 'Summer saver'], nights: 7,
  },
  {
    destCode: 'TFS', price: 88, originalPrice: 248, airline: 'Jet2',
    dealType: 'Flash Sale', monthOffset: 2, dayOfMonth: 16,
    departureAirport: 'LGW', category: 'beach-canaries',
    tags: ['Canaries', 'Guaranteed sun'], nights: 7,
  },
  {
    destCode: 'BKK', price: 348, originalPrice: 950, airline: 'Qatar Airways',
    dealType: "Jack's Find", monthOffset: 2, dayOfMonth: 5,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ["Jack's Flight Club", 'Southeast Asia'], nights: 14,
  },
  {
    destCode: 'NRT', price: 412, originalPrice: 1100, airline: 'Japan Airlines',
    dealType: 'Error Fare', monthOffset: 2, dayOfMonth: 9,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ['Error fare', 'Japan'], nights: 10,
  },
  {
    destCode: 'MIA', price: 289, originalPrice: 750, airline: 'Virgin Atlantic',
    dealType: 'Flash Sale', monthOffset: 2, dayOfMonth: 14,
    departureAirport: 'LHR', category: 'transatlantic',
    tags: ['Miami', 'Summer getaway'], nights: 10,
  },
  {
    destCode: 'SIN', price: 368, originalPrice: 890, airline: 'Singapore Airlines',
    dealType: 'Sale', monthOffset: 2, dayOfMonth: 19,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ['Singapore', 'Asia stopover'], nights: 10,
  },
  {
    destCode: 'DPS', price: 425, originalPrice: 1100, airline: 'KLM',
    dealType: 'Sale', monthOffset: 2, dayOfMonth: 22,
    departureAirport: 'LHR', category: 'long-haul-asia',
    tags: ['Bali', 'Dream holiday'], nights: 14,
  },
  {
    destCode: 'CUN', price: 318, originalPrice: 830, airline: 'TUI Airways',
    dealType: 'Flash Sale', monthOffset: 2, dayOfMonth: 15,
    departureAirport: 'LGW', category: 'transatlantic',
    tags: ['Cancun', 'All-inclusive'], nights: 10,
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
    };
  });
}
