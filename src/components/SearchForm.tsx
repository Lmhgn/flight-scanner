'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, ArrowLeftRight, X, ChevronDown } from 'lucide-react';
import { searchAirports, LONDON_AIRPORTS } from '@/lib/airports';
import type { Airport, CabinClass } from '@/types/flights';

const LONDON_OPTION = {
  code: 'LON',
  name: 'All London Airports',
  city: 'London',
  country: 'United Kingdom',
  flag: '🇬🇧',
};

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First' },
];

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

interface AirportPickerProps {
  value: Airport | null;
  placeholder: string;
  onChange: (airport: Airport) => void;
  excludeCode?: string;
  allowAnyDest?: boolean;
  defaultOptions?: Airport[];
}

function AirportPicker({
  value,
  placeholder,
  onChange,
  excludeCode,
  allowAnyDest = false,
  defaultOptions,
}: AirportPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = query.length > 0 ? searchAirports(query).filter((a) => a.code !== excludeCode) : (defaultOptions ?? []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        className="search-input rounded-xl px-4 py-3 flex items-center gap-2 cursor-text"
        onClick={() => setOpen(true)}
      >
        <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
        {open ? (
          <input
            autoFocus
            className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-500 text-sm"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        ) : (
          <span className={`flex-1 text-sm truncate ${value ? 'text-slate-100' : 'text-slate-500'}`}>
            {value ? (
              <span className="flex items-center gap-2">
                <span>{value.flag}</span>
                <span>{value.city === 'London' && value.code !== 'LON' ? `${value.name}` : value.city === 'London' ? 'All London Airports' : value.city}</span>
                <span className="text-slate-500 text-xs">({value.code})</span>
              </span>
            ) : placeholder}
          </span>
        )}
        {value && !open && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(LONDON_OPTION as Airport); }}
            className="text-slate-500 hover:text-slate-300 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#0a1628] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* London group */}
          {(query === '' || 'london'.includes(query.toLowerCase())) && (
            <div>
              <div className="px-3 pt-2 pb-1 text-xs text-slate-500 font-medium uppercase tracking-wide">
                London Airports
              </div>
              {[LONDON_OPTION, ...Object.values(LONDON_AIRPORTS)].map((apt) => (
                <button
                  key={apt.code}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center gap-3 transition-colors"
                  onClick={() => { onChange(apt as Airport); setOpen(false); setQuery(''); }}
                >
                  <span className="text-lg">{apt.flag}</span>
                  <div>
                    <p className="text-sm text-slate-200">{apt.name}</p>
                    <p className="text-xs text-slate-500">{apt.code} &middot; United Kingdom</p>
                  </div>
                </button>
              ))}
              <div className="border-t border-white/5 my-1" />
            </div>
          )}

          {/* Search results */}
          {results.length > 0 && (
            <div>
              {query && <div className="px-3 pt-2 pb-1 text-xs text-slate-500 font-medium uppercase tracking-wide">Results</div>}
              {results.map((apt) => (
                <button
                  key={apt.code}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/5 flex items-center gap-3 transition-colors"
                  onClick={() => { onChange(apt); setOpen(false); setQuery(''); }}
                >
                  <span className="text-lg">{apt.flag}</span>
                  <div>
                    <p className="text-sm text-slate-200">{apt.city}</p>
                    <p className="text-xs text-slate-500">{apt.code} &middot; {apt.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {allowAnyDest && query === '' && (
            <button
              className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 border-t border-white/5"
              onClick={() => {
                onChange({ code: 'ANY', name: 'Anywhere', city: 'Anywhere', country: '', flag: '🌍' });
                setOpen(false); setQuery('');
              }}
            >
              <span className="text-lg">🌍</span>
              <div>
                <p className="text-sm text-slate-200">Anywhere</p>
                <p className="text-xs text-slate-500">Show me the cheapest destinations</p>
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
  const [origin, setOrigin] = useState<Airport>(LONDON_OPTION as Airport);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState(daysFromNow(7));
  const [returnDate, setReturnDate] = useState(daysFromNow(14));
  const [isReturn, setIsReturn] = useState(true);
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<CabinClass>('ECONOMY');
  const [showCabin, setShowCabin] = useState(false);

  function handleSwap() {
    if (destination) {
      const prev = origin;
      setOrigin(destination);
      setDestination(prev);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      origin: origin.code,
      originCity: origin.city,
      destination: destination?.code ?? 'ANY',
      destinationCity: destination?.city ?? 'Anywhere',
      departDate,
      adults: String(adults),
      cabin,
      ...(isReturn && returnDate ? { returnDate } : {}),
    });
    router.push(`/search?${params}`);
  }

  if (minimal) {
    return (
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-[180px]">
          <AirportPicker
            value={origin}
            placeholder="From"
            onChange={setOrigin}
            defaultOptions={[]}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <AirportPicker
            value={destination}
            placeholder="To (anywhere)"
            onChange={setDestination}
            excludeCode={origin.code}
            allowAnyDest
            defaultOptions={[]}
          />
        </div>
        <input
          type="date"
          value={departDate}
          min={today()}
          onChange={(e) => setDepartDate(e.target.value)}
          className="search-input rounded-xl px-3 py-3 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="glass-card rounded-2xl p-4 sm:p-6 space-y-4"
    >
      {/* Trip type toggle */}
      <div className="flex items-center gap-4">
        <div className="flex bg-white/5 rounded-lg p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setIsReturn(false)}
            className={`px-3 py-1.5 rounded-md transition-all font-medium ${!isReturn ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            One way
          </button>
          <button
            type="button"
            onClick={() => setIsReturn(true)}
            className={`px-3 py-1.5 rounded-md transition-all font-medium ${isReturn ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Return
          </button>
        </div>

        {/* Cabin class */}
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setShowCabin(!showCabin)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            {CABIN_OPTIONS.find((c) => c.value === cabin)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showCabin && (
            <div className="absolute right-0 top-full mt-1 bg-[#0a1628] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[160px]">
              {CABIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${cabin === opt.value ? 'text-blue-400' : 'text-slate-300'}`}
                  onClick={() => { setCabin(opt.value); setShowCabin(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Origin / Destination row */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-2 items-center">
        <AirportPicker
          value={origin}
          placeholder="From — London"
          onChange={setOrigin}
          excludeCode={destination?.code}
          defaultOptions={[]}
        />

        <button
          type="button"
          onClick={handleSwap}
          disabled={!destination}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 transition-all disabled:opacity-30 mx-auto"
        >
          <ArrowLeftRight className="w-4 h-4 text-slate-400" />
        </button>

        <AirportPicker
          value={destination}
          placeholder="To — anywhere"
          onChange={setDestination}
          excludeCode={origin.code}
          allowAnyDest
          defaultOptions={[]}
        />
      </div>

      {/* Dates + passengers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="space-y-1">
          <label className="text-xs text-slate-500 block px-1">Depart</label>
          <input
            type="date"
            value={departDate}
            min={today()}
            onChange={(e) => setDepartDate(e.target.value)}
            className="search-input rounded-xl px-3 py-2.5 text-sm w-full"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500 block px-1">Return</label>
          <input
            type="date"
            value={returnDate}
            min={departDate}
            disabled={!isReturn}
            onChange={(e) => setReturnDate(e.target.value)}
            className="search-input rounded-xl px-3 py-2.5 text-sm w-full disabled:opacity-30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500 block px-1">Passengers</label>
          <div className="search-input rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <button
              type="button"
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="text-slate-400 hover:text-white w-5 text-center"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-medium">{adults}</span>
            <button
              type="button"
              onClick={() => setAdults(Math.min(9, adults + 1))}
              className="text-slate-400 hover:text-white w-5 text-center"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Search className="w-4 h-4" />
            Search Flights
          </button>
        </div>
      </div>
    </form>
  );
}
