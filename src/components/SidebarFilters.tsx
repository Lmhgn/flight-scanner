'use client';

import { useState } from 'react';
import type { FlightSource } from '@/types/flights';
import { SOURCE_META } from '@/lib/deepLinks';

export interface Filters {
  sources: FlightSource[];
  maxPrice: number;
  stops: number | null;
  airlines: string[];
}

const ALL_SOURCES = Object.keys(SOURCE_META) as FlightSource[];

export const ALL_AIRLINES = [
  'British Airways', 'easyJet', 'Ryanair', 'Wizz Air',
  'Jet2', 'Norwegian', 'KLM', 'Emirates', 'Virgin Atlantic',
];

export const DEFAULT_FILTERS: Filters = {
  sources: [...ALL_SOURCES],
  maxPrice: 2000,
  stops: null,
  airlines: [...ALL_AIRLINES],
};

interface Props {
  onChange?: (filters: Filters) => void;
}

export default function SidebarFilters({ onChange }: Props) {
  const [sources, setSources] = useState<FlightSource[]>([...ALL_SOURCES]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [stops, setStops] = useState<number | null>(null);
  const [airlines, setAirlines] = useState<string[]>([...ALL_AIRLINES]);

  function emit(overrides: Partial<Filters>) {
    onChange?.({ sources, maxPrice, stops, airlines, ...overrides });
  }

  function toggleSource(s: FlightSource) {
    const next = sources.includes(s) ? sources.filter((x) => x !== s) : [...sources, s];
    setSources(next);
    emit({ sources: next });
  }

  function toggleAirline(a: string) {
    const next = airlines.includes(a) ? airlines.filter((x) => x !== a) : [...airlines, a];
    setAirlines(next);
    emit({ airlines: next });
  }

  function setStopsFilter(s: number | null) {
    setStops(s);
    emit({ stops: s });
  }

  function handlePriceChange(v: number) {
    setMaxPrice(v);
    emit({ maxPrice: v });
  }

  function reset() {
    setSources([...ALL_SOURCES]);
    setMaxPrice(2000);
    setStops(null);
    setAirlines([...ALL_AIRLINES]);
    onChange?.(DEFAULT_FILTERS);
  }

  const activeFilterCount = [
    sources.length < ALL_SOURCES.length,
    maxPrice < 2000,
    stops !== null,
    airlines.length < ALL_AIRLINES.length,
  ].filter(Boolean).length;

  return (
    <aside className="col-span-3 space-y-8">
      <div className="bg-surface-container-low p-6 rounded-lg space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-headline font-bold text-lg text-primary">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-on-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button onClick={reset} className="text-xs font-semibold text-secondary uppercase tracking-wider hover:underline">
            Reset All
          </button>
        </div>

        {/* Deal Source */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Source</span>
          <div className="space-y-2">
            {ALL_SOURCES.map((s) => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sources.includes(s)}
                  onChange={() => toggleSource(s)}
                  className="rounded border-outline-variant accent-primary"
                />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {SOURCE_META[s].label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Max Price</span>
          <input
            type="range"
            min={0}
            max={2000}
            step={25}
            value={maxPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none accent-primary"
          />
          <div className="flex justify-between text-xs font-medium text-on-surface-variant">
            <span>£0</span>
            <span className={`font-bold ${maxPrice < 2000 ? 'text-primary' : 'text-outline'}`}>
              {maxPrice < 2000 ? `£${maxPrice}` : 'Any'}
            </span>
          </div>
        </div>

        {/* Stops */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Stops</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Non-stop', value: 0 },
              { label: '1 Stop',   value: 1 },
              { label: '2+ Stops', value: 2 },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setStopsFilter(stops === value ? null : value)}
                className={`py-2 text-xs font-bold rounded transition-colors ${
                  stops === value
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant hover:bg-surface-container-highest'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Airlines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-outline">Airlines</span>
            {airlines.length < ALL_AIRLINES.length && (
              <button
                onClick={() => { setAirlines([...ALL_AIRLINES]); emit({ airlines: [...ALL_AIRLINES] }); }}
                className="text-[10px] text-secondary hover:underline font-medium"
              >
                Select all
              </button>
            )}
          </div>
          <div className="space-y-2">
            {ALL_AIRLINES.map((a) => (
              <label key={a} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={airlines.includes(a)}
                  onChange={() => toggleAirline(a)}
                  className="rounded border-outline-variant accent-primary"
                />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">{a}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Promo card */}
      <div className="relative overflow-hidden rounded-lg bg-primary-container p-6">
        <div className="relative z-10 space-y-2">
          <h4 className="font-headline font-bold text-xl leading-tight text-on-primary">Unlock Hidden Itineraries</h4>
          <p className="text-sm text-primary-fixed leading-relaxed">
            Upgrade to Pro to see secret error fares and cross-alliance routings.
          </p>
          <button className="mt-4 px-4 py-2 bg-secondary text-on-secondary text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined" style={{ fontSize: '100px' }}>flight_takeoff</span>
        </div>
      </div>
    </aside>
  );
}
