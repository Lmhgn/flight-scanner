import type { Deal } from '@/types/flights';

const STORAGE_KEY = 'flightflux_saved_trips';

export function getSavedTrips(): Deal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Deal[]) : [];
  } catch {
    return [];
  }
}

export function saveTrip(deal: Deal): void {
  const trips = getSavedTrips();
  if (!trips.find((t) => t.id === deal.id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...trips, deal]));
  }
}

export function removeSavedTrip(dealId: string): void {
  const trips = getSavedTrips().filter((t) => t.id !== dealId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function isTripSaved(dealId: string): boolean {
  return getSavedTrips().some((t) => t.id === dealId);
}

export function getSavedCount(): number {
  return getSavedTrips().length;
}
