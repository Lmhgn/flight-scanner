'use client';

import { useState, useEffect } from 'react';
import type { Deal } from '@/types/flights';
import { isTripSaved, saveTrip, removeSavedTrip } from '@/lib/savedTrips';

interface Props {
  deal: Deal;
  className?: string;
}

export default function SaveButton({ deal, className = '' }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isTripSaved(deal.id));
  }, [deal.id]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeSavedTrip(deal.id);
      setSaved(false);
    } else {
      saveTrip(deal);
      setSaved(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove from saved trips' : 'Save trip'}
      className={`p-1.5 rounded-full transition-all duration-200 ${saved ? 'text-primary' : 'text-white/70 hover:text-white'} ${className}`}
    >
      <span
        className="material-symbols-outlined text-xl leading-none"
        style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
      >
        bookmark
      </span>
    </button>
  );
}
