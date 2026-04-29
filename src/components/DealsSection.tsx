'use client';

import { useState } from 'react';
import type { Deal, LondonAirport } from '@/types/flights';
import DealCard, { FeaturedCard, RegularCard, CompactCard } from './DealCard';
import { getMonthBuckets } from '@/lib/utils';
import { format, addMonths } from 'date-fns';
import Link from 'next/link';

interface Props {
  deals: Deal[];
}

type AirportFilter = 'ALL' | LondonAirport;

const AIRPORT_FILTERS: { value: AirportFilter; label: string }[] = [
  { value: 'ALL', label: 'All airports' },
  { value: 'LHR', label: 'Heathrow' },
  { value: 'LGW', label: 'Gatwick' },
  { value: 'STN', label: 'Stansted' },
  { value: 'LTN', label: 'Luton' },
  { value: 'LCY', label: 'City' },
];

const MONTH_BADGE_STYLES = [
  'bg-secondary-fixed text-on-secondary-container',
  'bg-surface-container-highest text-on-surface-variant',
  'bg-surface-container-highest text-on-surface-variant',
];

function sectionTitle(offset: number): string {
  return format(addMonths(new Date(), offset), 'MMMM');
}

function ViewAllLink({ text, href }: { text: string; href: string }) {
  return (
    <Link href={href} className="text-primary font-bold flex items-center gap-1 hover:underline underline-offset-4 text-sm">
      {text}
      <span className="material-symbols-outlined text-sm">arrow_forward</span>
    </Link>
  );
}

function CurrentMonthSection({ deals, offset }: { deals: Deal[]; offset: number }) {
  const shown = deals.slice(0, 3);
  const month = sectionTitle(offset);
  return (
    <section>
      <div className="flex items-baseline justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-3xl font-bold">{month}</h2>
          <span className={`${MONTH_BADGE_STYLES[0]} px-3 py-1 rounded-full text-xs font-bold font-label`}>CURRENT MONTH</span>
        </div>
        <ViewAllLink text={`View all ${month} deals`} href="/search?origin=LON&destination=ANY&departDate=&cabin=ECONOMY&adults=1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shown.map((deal) => <DealCard key={deal.id} deal={deal} variant="portrait" />)}
      </div>
    </section>
  );
}

function NextMonthSection({ deals, offset }: { deals: Deal[]; offset: number }) {
  const month = sectionTitle(offset);
  const featured = deals[0];
  const regulars = deals.slice(1, 3);
  const badge = MONTH_BADGE_STYLES[1];

  return (
    <section>
      <div className="flex items-baseline justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-3xl font-bold">{month}</h2>
          <span className={`${badge} px-3 py-1 rounded-full text-xs font-bold font-label tracking-wide`}>UPCOMING</span>
        </div>
        <ViewAllLink text={`Browse ${month}`} href="/search?origin=LON&destination=ANY&departDate=&cabin=ECONOMY&adults=1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {featured && <FeaturedCard deal={featured} />}
        {regulars.map((deal) => <RegularCard key={deal.id} deal={deal} />)}
      </div>
    </section>
  );
}

function MonthAfterSection({ deals, offset }: { deals: Deal[]; offset: number }) {
  const month = sectionTitle(offset);
  const SEASON_MAP: Record<string, string> = {
    December: 'FESTIVE SEASON', May: 'SUMMER AHEAD', June: 'SUMMER AHEAD',
    July: 'PEAK SUMMER', August: 'PEAK SUMMER', September: 'AUTUMN TRAVEL',
    October: 'AUTUMN TRAVEL', November: 'WINTER DEALS', January: 'NEW YEAR DEALS',
    February: 'WINTER ESCAPES', March: 'SPRING PREVIEW', April: 'SPRING TRAVEL',
  };
  return (
    <section>
      <div className="flex items-baseline justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-3xl font-bold">{month}</h2>
          <span className={`${MONTH_BADGE_STYLES[2]} px-3 py-1 rounded-full text-xs font-bold font-label tracking-wide`}>
            {SEASON_MAP[month] ?? 'UPCOMING'}
          </span>
        </div>
        <ViewAllLink text={`Search ${month.toLowerCase()} routes`} href="/search?origin=LON&destination=ANY&departDate=&cabin=ECONOMY&adults=1" />
      </div>
      <div className="bg-surface-container-low rounded-xl p-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {deals.slice(0, 4).map((deal, i) => <CompactCard key={deal.id} deal={deal} isFirst={i === 0} />)}
        </div>
      </div>
    </section>
  );
}

export default function DealsSection({ deals }: Props) {
  const months = getMonthBuckets(3);
  const [airportFilter, setAirportFilter] = useState<AirportFilter>('ALL');

  const filtered = airportFilter === 'ALL'
    ? deals
    : deals.filter((d) => d.departureAirport === airportFilter);

  const buckets = months.map((m) => filtered.filter((d) => d.month === m.month));

  return (
    <div>
      {/* Airport filter */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
        <span className="text-xs text-outline font-medium whitespace-nowrap mr-1">Fly from:</span>
        {AIRPORT_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setAirportFilter(value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 ${
              airportFilter === value
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-primary/40 hover:text-primary'
            }`}
          >
            {value !== 'ALL' && <span className="font-mono mr-1">{value}</span>}
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-24">
        <CurrentMonthSection deals={buckets[0]} offset={0} />
        <NextMonthSection deals={buckets[1]} offset={1} />
        <MonthAfterSection deals={buckets[2]} offset={2} />
      </div>
    </div>
  );
}
