'use client';

import { useState, useEffect } from 'react';
import type { Flight, CabinClass, FlightSource } from '@/types/flights';
import FlightCard from './FlightCard';
import { searchFlightsClient } from '@/lib/clientSearch';
import type { Filters } from './SidebarFilters';
import { DEFAULT_FILTERS } from './SidebarFilters';

interface Props {
  searchParams: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    adults: number;
    cabin: string;
    originCity?: string;
    destinationCity?: string;
  };
  filters?: Filters;
}

type SortKey = 'recommended' | 'price' | 'duration';

export default function FlightResults({ searchParams, filters = DEFAULT_FILTERS }: Props) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>('recommended');

  useEffect(() => {
    setLoading(true);
    // Simulate a brief scan delay for UX
    const timer = setTimeout(() => {
      const results = searchFlightsClient({
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departDate,
        returnDate: searchParams.returnDate,
        adults: searchParams.adults,
        cabinClass: searchParams.cabin as CabinClass,
      });
      setFlights(results);
      setLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, [searchParams.origin, searchParams.destination, searchParams.departDate, searchParams.returnDate, searchParams.adults, searchParams.cabin]);

  const sorted = [...flights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.stops - b.stops;
    const scoreOrder = { great: 0, good: 1, normal: 2 };
    return scoreOrder[a.dealScore] - scoreOrder[b.dealScore] || a.price - b.price;
  });

  const filtered = sorted.filter((f) => {
    if (filters.maxPrice < 2000 && f.price > filters.maxPrice) return false;
    if (filters.stops !== null) {
      if (filters.stops === 2 && f.stops < 2) return false;
      if (filters.stops < 2 && f.stops !== filters.stops) return false;
    }
    if (!filters.sources.includes(f.primarySource as FlightSource)) return false;
    if (!filters.airlines.includes(f.airline)) return false;
    return true;
  });

  const isAny = searchParams.destination === 'ANY' || !searchParams.destination;
  const { originCity = searchParams.origin } = searchParams;
  const destinationCity = isAny ? 'Everywhere' : (searchParams.destinationCity ?? searchParams.destination);

  if (loading) {
    return (
      <div className="col-span-9 space-y-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-lg p-6 animate-pulse">
              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-2 flex gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-surface-container rounded" />
                    <div className="h-2 w-12 bg-surface-container rounded" />
                  </div>
                </div>
                <div className="col-span-5 flex gap-4 px-4">
                  <div className="h-6 w-12 bg-surface-container rounded" />
                  <div className="flex-1 h-px bg-surface-container self-center" />
                  <div className="h-6 w-12 bg-surface-container rounded" />
                </div>
                <div className="col-span-2 h-8 bg-surface-container rounded" />
                <div className="col-span-3 space-y-2">
                  <div className="h-8 w-20 bg-surface-container rounded ml-auto" />
                  <div className="h-10 bg-surface-container rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-outline">
          <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
          Checking prices…
        </div>
      </div>
    );
  }

  return (
    <section className="col-span-9 space-y-6">
      {/* Results header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">
            {originCity} → {destinationCity}
          </h1>
          <p className="text-sm text-outline mt-1">
            {filtered.length}{filtered.length !== flights.length ? ` of ${flights.length}` : ''} flights
            {searchParams.departDate ? ` · ${searchParams.departDate}` : ''}
            {searchParams.returnDate ? ` – ${searchParams.returnDate}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-outline uppercase tracking-widest">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="price">Lowest Price</option>
            <option value="duration">Fewest Stops</option>
          </select>
        </div>
      </div>

      {/* Result cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center gap-3">
            <span className="material-symbols-outlined text-outline/40 text-5xl">filter_list_off</span>
            <p className="font-headline font-bold text-lg text-on-surface-variant">No results match your filters</p>
            <p className="text-sm text-outline">Try widening the price range or selecting more airlines and sources.</p>
          </div>
        ) : filtered.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>

      {/* Hidden city note */}
      <p className="text-xs text-outline pt-4 border-t border-outline-variant/15">
        Some fares above may be &ldquo;hidden city&rdquo; tickets — exit at your destination while the plane continues elsewhere.
        Do not check bags on these routes. Verify all fares on the source before booking.
      </p>
    </section>
  );
}
