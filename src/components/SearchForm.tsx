'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchAirports, LONDON_AIRPORTS } from '@/lib/airports';
import type { Airport, CabinClass } from '@/types/flights';

const LONDON_OPTION: Airport = {
  code: 'LON',
  name: 'All London Airports',
  city: 'London',
  country: 'United Kingdom',
  flag: '🇬🇧',
};

function today(): string {
  return new Date().toISOString().split('T')[0];
}
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

interface AirportDropdownProps {
  value: Airport | null;
  placeholder: string;
  icon: string;
  onChange: (a: Airport) => void;
  excludeCode?: string;
  allowAny?: boolean;
  readOnly?: boolean;
}

function AirportDropdown({
  value,
  placeholder,
  icon,
  onChange,
  excludeCode,
  allowAny = false,
  readOnly = false,
}: AirportDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const results = query.length > 0
    ? searchAirports(query).filter((a) => a.code !== excludeCode)
    : [];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function displayValue(): string {
    if (!value) return '';
    if (value.code === 'LON') return 'London (LHR, LGW, STN)';
    if (value.code === 'ANY') return '';
    return `${value.city} (${value.code})`;
  }

  return (
    <div ref={ref} className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary pointer-events-none">
        {icon}
      </span>
      <input
        className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-lg font-medium focus:ring-2 focus:ring-primary-fixed transition-all text-sm text-on-surface outline-none"
        placeholder={placeholder}
        readOnly={readOnly}
        value={open ? query : displayValue()}
        onFocus={() => { if (!readOnly) setOpen(true); }}
        onChange={(e) => { setQuery(e.target.value); }}
      />

      {open && !readOnly && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 min-w-[280px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden">
          {/* London airports group */}
          {(query === '' || 'london'.includes(query.toLowerCase())) && (
            <>
              <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-outline">
                London Airports
              </div>
              {[LONDON_OPTION, ...Object.values(LONDON_AIRPORTS)].map((apt) => (
                <button
                  key={apt.code}
                  className="w-full text-left px-4 py-2.5 hover:bg-surface-container flex items-center gap-3 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(apt as Airport);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <span className="text-base">{apt.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{apt.name}</p>
                    <p className="text-xs text-outline">{apt.code}</p>
                  </div>
                </button>
              ))}
              <div className="border-t border-outline-variant/30 my-1" />
            </>
          )}

          {/* Search results */}
          {results.map((apt) => (
            <button
              key={apt.code}
              className="w-full text-left px-4 py-2.5 hover:bg-surface-container flex items-center gap-3 transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(apt);
                setOpen(false);
                setQuery('');
              }}
            >
              <span className="text-base">{apt.flag}</span>
              <div>
                <p className="text-sm font-medium text-on-surface">{apt.city}</p>
                <p className="text-xs text-outline">{apt.code} · {apt.country}</p>
              </div>
            </button>
          ))}

          {allowAny && query === '' && (
            <button
              className="w-full text-left px-4 py-3 hover:bg-surface-container flex items-center gap-3 border-t border-outline-variant/30"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange({ code: 'ANY', name: 'Anywhere', city: 'Anywhere', country: '', flag: '🌍' });
                setOpen(false);
                setQuery('');
              }}
            >
              <span className="text-base">🌍</span>
              <div>
                <p className="text-sm font-medium text-on-surface">Anywhere</p>
                <p className="text-xs text-outline">Show me the cheapest destinations</p>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchForm({ minimal = false }: { minimal?: boolean }) {
  const router = useRouter();
  const [origin, setOrigin] = useState<Airport>(LONDON_OPTION);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState(daysFromNow(7));
  const [returnDate, setReturnDate] = useState(daysFromNow(14));
  const [adults, setAdults] = useState(1);
  const [cabin] = useState<CabinClass>('ECONOMY');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      origin: origin.code,
      originCity: origin.city,
      destination: destination?.code ?? 'ANY',
      destinationCity: destination?.city ?? 'Anywhere',
      departDate,
      returnDate,
      adults: String(adults),
      cabin,
    });
    router.push(`/search?${params}`);
  }

  if (minimal) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-center bg-surface-container-low p-4 rounded-xl">
        <div className="flex-1 min-w-[160px]">
          <AirportDropdown value={origin} placeholder="From" icon="flight_takeoff" onChange={setOrigin} excludeCode={destination?.code} />
        </div>
        <div className="flex-1 min-w-[160px]">
          <AirportDropdown value={destination} placeholder="To — anywhere" icon="location_on" onChange={setDestination} excludeCode={origin.code} allowAny />
        </div>
        <div className="relative min-w-[150px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-sm">calendar_today</span>
          <input type="date" value={departDate} min={today()} onChange={(e) => setDepartDate(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-lg font-medium focus:ring-2 focus:ring-primary-fixed transition-all text-sm outline-none" />
        </div>
        <button type="submit" className="primary-gradient text-on-primary font-bold px-6 py-4 rounded-lg flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all text-sm">
          <span className="material-symbols-outlined text-[18px]">search</span>
          Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Origin */}
        <div className="lg:col-span-3 space-y-2">
          <label className="font-label text-xs uppercase tracking-widest text-outline ml-1">Origin</label>
          <AirportDropdown
            value={origin}
            placeholder="London (LHR, LGW, STN)"
            icon="flight_takeoff"
            onChange={setOrigin}
            excludeCode={destination?.code}
          />
        </div>

        {/* Destination */}
        <div className="lg:col-span-3 space-y-2">
          <label className="font-label text-xs uppercase tracking-widest text-outline ml-1">Destination</label>
          <AirportDropdown
            value={destination}
            placeholder="Anywhere"
            icon="location_on"
            onChange={setDestination}
            excludeCode={origin.code}
            allowAny
          />
        </div>

        {/* Dates */}
        <div className="lg:col-span-4 space-y-2">
          <label className="font-label text-xs uppercase tracking-widest text-outline ml-1">Dates</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none">calendar_today</span>
              <input
                type="date"
                value={departDate}
                min={today()}
                onChange={(e) => setDepartDate(e.target.value)}
                placeholder="Departure"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-lg font-medium focus:ring-2 focus:ring-primary-fixed transition-all text-sm outline-none text-on-surface"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none">event_repeat</span>
              <input
                type="date"
                value={returnDate}
                min={departDate}
                onChange={(e) => setReturnDate(e.target.value)}
                placeholder="Return"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-lg font-medium focus:ring-2 focus:ring-primary-fixed transition-all text-sm outline-none text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Passengers hidden for cleanliness — defaults to 1 */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            className="w-full py-4 primary-gradient text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined">search</span>
            Find Deals
          </button>
        </div>
      </div>

      {/* Passenger row */}
      <div className="mt-4 flex items-center gap-4 text-sm text-outline">
        <span className="material-symbols-outlined text-[18px]">group</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}
            className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface">−</button>
          <span className="font-medium text-on-surface w-4 text-center">{adults}</span>
          <button type="button" onClick={() => setAdults(Math.min(9, adults + 1))}
            className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface">+</button>
          <span className="text-on-surface-variant">passenger{adults !== 1 ? 's' : ''} · Economy</span>
        </div>
      </div>
    </form>
  );
}
