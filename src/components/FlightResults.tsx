'use client';

import { useState, useEffect } from 'react';
import type { Flight } from '@/types/flights';
import FlightCard from './FlightCard';
import { Loader2, AlertCircle, SortAsc, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

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
}

type SortKey = 'price' | 'duration' | 'stops';

export default function FlightResults({ searchParams }: Props) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [filterStops, setFilterStops] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const qs = new URLSearchParams({
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departDate,
      adults: String(searchParams.adults),
      cabinClass: searchParams.cabin,
      ...(searchParams.returnDate ? { returnDate: searchParams.returnDate } : {}),
    });

    fetch(`/api/flights?${qs}`)
      .then((r) => {
        if (!r.ok) throw new Error('Search failed');
        return r.json();
      })
      .then((data) => setFlights(data.flights ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [
    searchParams.origin,
    searchParams.destination,
    searchParams.departDate,
    searchParams.returnDate,
    searchParams.adults,
    searchParams.cabin,
  ]);

  const sorted = [...flights]
    .filter((f) => filterStops === null || f.stops === filterStops)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stops') return a.stops - b.stops;
      return 0;
    });

  const cheapest = sorted[0]?.price;
  const directFlights = flights.filter((f) => f.stops === 0);
  const greatDeals = flights.filter((f) => f.dealScore === 'great');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-slate-300 font-medium">Scanning 5 sources...</p>
          <p className="text-sm text-slate-500 mt-1">
            Google Flights · Skyscanner · ITA Matrix · Skiplagged · Jack&apos;s Flight Club
          </p>
        </div>
        {/* Animated source scan */}
        <div className="flex gap-2 mt-2">
          {['Google', 'Skyscanner', 'ITA Matrix', 'Skiplagged', "Jack's"].map((s, i) => (
            <span
              key={s}
              className="text-xs px-2 py-1 bg-white/5 rounded-full text-slate-500 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-300 font-medium">Something went wrong</p>
        <p className="text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-300 font-medium">No flights found</p>
        <p className="text-sm text-slate-500 mt-1">Try different dates or a nearby airport</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Results', value: `${flights.length} flights` },
          { label: 'Cheapest', value: cheapest ? formatPrice(cheapest) : '—' },
          { label: 'Direct flights', value: `${directFlights.length}` },
          { label: 'Great deals', value: `${greatDeals.length}` },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl px-4 py-3">
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className="text-lg font-bold text-white mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + sort */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Stops:</span>
        </div>
        {[null, 0, 1].map((s) => (
          <button
            key={String(s)}
            onClick={() => setFilterStops(s)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              filterStops === s
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-white/4 border-white/8 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s === null ? 'Any' : s === 0 ? 'Direct only' : '1 stop'}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="search-input text-xs rounded-lg px-2 py-1.5 cursor-pointer"
          >
            <option value="price">Sort: Price</option>
            <option value="stops">Sort: Stops</option>
          </select>
        </div>
      </div>

      {/* Flight list */}
      <div className="space-y-3">
        {sorted.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            departureDate={searchParams.departDate}
            returnDate={searchParams.returnDate}
          />
        ))}
      </div>
    </div>
  );
}
