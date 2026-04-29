'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import FlightResults from '@/components/FlightResults';
import SidebarFilters, { DEFAULT_FILTERS } from '@/components/SidebarFilters';
import type { Filters } from '@/components/SidebarFilters';
import Link from 'next/link';

function SearchContent() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const origin          = params.get('origin')          ?? 'LON';
  const originCity      = params.get('originCity')      ?? 'London';
  const destination     = params.get('destination')     ?? 'ANY';
  const destinationCity = params.get('destinationCity') ?? 'Anywhere';
  const departDate      = params.get('departDate')      ?? '';
  const returnDate      = params.get('returnDate')      ?? undefined;
  const adults          = parseInt(params.get('adults') ?? '1', 10);
  const cabin           = params.get('cabin')           ?? 'ECONOMY';

  const hasValidSearch = !!(origin && destination && departDate && destination !== 'ANY');

  return (
    <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 md:px-10 py-8 grid grid-cols-12 gap-8">
      <SidebarFilters onChange={setFilters} />

      {!hasValidSearch ? (
        <div className="col-span-9 flex flex-col items-center justify-center py-24 text-center gap-4">
          <span className="material-symbols-outlined text-outline text-5xl">travel_explore</span>
          <h2 className="font-headline font-bold text-2xl text-primary">Choose a destination</h2>
          <p className="text-on-surface-variant max-w-sm">
            Select a specific destination above to search for flights, or browse the{' '}
            <Link href="/" className="text-secondary font-medium hover:underline">home page deals</Link>.
          </p>
        </div>
      ) : (
        <FlightResults
          searchParams={{ origin, destination, departDate, returnDate, adults, cabin, originCity, destinationCity }}
          filters={filters}
        />
      )}
    </main>
  );
}

function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-10 mt-auto bg-surface-container-low border-t border-outline-variant/15">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-center gap-8 max-w-[1600px] mx-auto">
        <div className="space-y-2">
          <span className="font-headline font-bold text-lg text-on-surface">FlightFlux</span>
          <p className="font-body text-xs uppercase tracking-widest text-outline">
            © {new Date().getFullYear()} FlightFlux. Editorial Aviation &amp; High-Trust Travel.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 lg:gap-12">
          {['About Us', 'Hidden Deals Guide', 'Privacy', 'Terms', 'API Access'].map((item) => (
            <a key={item} href="#"
              className="font-body text-xs uppercase tracking-widest text-outline hover:underline decoration-secondary underline-offset-4 transition-colors">
              {item}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="border-b border-outline-variant/20 bg-surface-container-low">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-4">
          <SearchForm minimal />
        </div>
      </div>

      {/* Suspense is required when using useSearchParams in static export */}
      <Suspense fallback={
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
            <p className="text-outline text-sm font-medium">Loading…</p>
          </div>
        </main>
      }>
        <SearchContent />
      </Suspense>

      <Footer />
    </div>
  );
}
