'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import DealCard from '@/components/DealCard';
import type { Deal } from '@/types/flights';
import { getSavedTrips, removeSavedTrip } from '@/lib/savedTrips';

export default function SavedTripsPage() {
  const [trips, setTrips] = useState<Deal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTrips(getSavedTrips());
    setLoaded(true);
  }, []);

  function handleRemove(id: string) {
    removeSavedTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 md:px-10 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
            <h1 className="font-headline text-4xl font-extrabold text-primary">Saved Trips</h1>
          </div>
          <p className="text-on-surface-variant text-base">
            Deals you&apos;ve bookmarked — stored locally in your browser.
          </p>
        </div>

        {!loaded ? null : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-outline/40 mb-6" style={{ fontSize: '80px' }}>bookmark_border</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface-variant mb-3">No saved trips yet</h2>
            <p className="text-outline max-w-sm mb-8">
              Browse deals on the homepage and tap the bookmark icon to save them here.
            </p>
            <Link
              href="/"
              className="primary-gradient text-on-primary px-8 py-3 rounded-lg font-bold text-sm hover:shadow-lg transition-all"
            >
              Explore Deals
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-outline font-medium">{trips.length} saved deal{trips.length !== 1 ? 's' : ''}</p>
              <button
                onClick={() => {
                  trips.forEach((t) => removeSavedTrip(t.id));
                  setTrips([]);
                }}
                className="text-xs text-outline hover:text-error transition-colors font-medium flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((deal) => (
                <div key={deal.id} className="relative group">
                  <DealCard deal={deal} variant="portrait" />
                  <button
                    onClick={() => handleRemove(deal.id)}
                    className="absolute top-6 left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-error text-on-error text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide z-10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="w-full py-8 px-6 md:px-10 mt-auto bg-surface-container-low border-t border-outline-variant/15">
        <div className="max-w-[1600px] mx-auto">
          <p className="font-body text-xs uppercase tracking-widest text-outline">
            © {new Date().getFullYear()} FlightFlux. Saved trips are stored in your browser only.
          </p>
        </div>
      </footer>
    </div>
  );
}
