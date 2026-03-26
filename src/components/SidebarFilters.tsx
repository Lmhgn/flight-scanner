'use client';

import { useState } from 'react';

interface Filters {
  sources: string[];
  maxPrice: number;
  stops: number | null;
  airlines: string[];
}

const ALL_SOURCES = ['ITA Matrix', 'Skiplagged', 'Direct Booking', 'Google Flights', 'Skyscanner'];
const ALL_AIRLINES = ['British Airways', 'easyJet', 'Ryanair', 'Wizz Air', 'Jet2', 'Norwegian', 'KLM', 'Emirates', 'Virgin Atlantic'];

interface Props {
  onChange?: (filters: Filters) => void;
}

export default function SidebarFilters({ onChange }: Props) {
  const [sources, setSources] = useState<string[]>(['ITA Matrix', 'Skiplagged']);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [stops, setStops] = useState<number | null>(null);
  const [airlines, setAirlines] = useState<string[]>(['British Airways', 'easyJet']);

  function toggleSource(s: string) {
    const next = sources.includes(s) ? sources.filter((x) => x !== s) : [...sources, s];
    setSources(next);
    onChange?.({ sources: next, maxPrice, stops, airlines });
  }

  function toggleAirline(a: string) {
    const next = airlines.includes(a) ? airlines.filter((x) => x !== a) : [...airlines, a];
    setAirlines(next);
    onChange?.({ sources, maxPrice, stops, airlines: next });
  }

  function setStopsFilter(s: number | null) {
    setStops(s);
    onChange?.({ sources, maxPrice, stops: s, airlines });
  }

  function reset() {
    setSources(['ITA Matrix', 'Skiplagged']);
    setMaxPrice(1200);
    setStops(null);
    setAirlines(['British Airways', 'easyJet']);
    onChange?.({ sources: ['ITA Matrix', 'Skiplagged'], maxPrice: 1200, stops: null, airlines: ['British Airways', 'easyJet'] });
  }

  return (
    <aside className="col-span-3 space-y-8">
      <div className="bg-surface-container-low p-6 rounded-lg space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg text-primary">Filters</h3>
          <button onClick={reset} className="text-xs font-semibold text-secondary uppercase tracking-wider hover:underline">
            Reset All
          </button>
        </div>

        {/* Deal Source */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Deal Source</span>
          <div className="space-y-2">
            {ALL_SOURCES.map((s) => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sources.includes(s)}
                  onChange={() => toggleSource(s)}
                  className="rounded border-outline-variant"
                />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Price Range</span>
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={maxPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxPrice(v);
              onChange?.({ sources, maxPrice: v, stops, airlines });
            }}
            className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none"
          />
          <div className="flex justify-between text-xs font-medium text-on-surface-variant">
            <span>£0</span>
            <span className="text-primary font-bold">£{maxPrice === 2000 ? '2000+' : maxPrice}</span>
          </div>
        </div>

        {/* Stops */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Stops</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Non-stop', value: 0 },
              { label: '1 Stop', value: 1 },
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
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Airlines</span>
          <div className="space-y-2">
            {ALL_AIRLINES.map((a) => (
              <label key={a} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={airlines.includes(a)}
                  onChange={() => toggleAirline(a)}
                  className="rounded border-outline-variant"
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
