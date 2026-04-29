'use client';

import { useState } from 'react';
import { addDays, format, isToday, isTomorrow, isWeekend } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Props {
  origin?: string;
  destination?: string;
  basePrice?: number;
}

// Price varies by day of week — mid-week cheapest, weekends expensive
function priceForDate(date: Date, base: number): number {
  const day = date.getDay(); // 0=Sun, 6=Sat
  const multipliers = [1.22, 1.0, 1.0, 1.03, 1.08, 1.18, 1.25];
  // Add a small pseudo-random variation per day so it looks like real data
  const seed = date.getDate() * 7 + date.getMonth();
  const jitter = ((seed % 11) - 5) * 0.8;
  return Math.round(base * multipliers[day] + jitter);
}

function dayLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tmrw';
  return format(date, 'EEE');
}

function priceColor(price: number, min: number, max: number): string {
  const ratio = (price - min) / (max - min);
  if (ratio < 0.25) return 'bg-secondary-container text-on-secondary-container border-secondary-container font-bold';
  if (ratio < 0.55) return 'bg-surface-container-lowest text-on-surface border-outline-variant/50';
  return 'bg-error-container/40 text-on-error-container border-error-container/40';
}

export default function FlexibleDateGrid({ origin = 'LON', destination = 'ANY', basePrice = 89 }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const today = new Date();

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i + 1);
    return { date, price: priceForDate(date, basePrice) };
  });

  const prices = days.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  function handleSelect(dateStr: string) {
    setSelected(dateStr);
    const ret = format(addDays(new Date(dateStr), 7), 'yyyy-MM-dd');
    const params = new URLSearchParams({
      origin, originCity: 'London',
      destination, destinationCity: destination === 'ANY' ? 'Anywhere' : destination,
      departDate: dateStr, returnDate: ret,
      adults: '1', cabin: 'ECONOMY',
    });
    router.push(`/search?${params}`);
  }

  return (
    <section className="mb-20">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          <h2 className="font-headline text-2xl font-bold">Cheapest Days to Fly</h2>
        </div>
        <p className="text-xs text-outline hidden sm:block">Prices from London · click any date to search</p>
      </div>

      <div className="bg-surface-container-low rounded-xl p-5">
        <div className="grid grid-cols-7 gap-2">
          {days.map(({ date, price }) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isSelected = selected === dateStr;
            const isWknd = isWeekend(date);
            const colorClass = isSelected
              ? 'bg-primary text-on-primary border-primary'
              : priceColor(price, min, max);

            return (
              <button
                key={dateStr}
                onClick={() => handleSelect(dateStr)}
                className={`rounded-lg border p-2 text-center transition-all duration-150 hover:scale-105 active:scale-95 ${colorClass} ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${isWknd && !isSelected ? 'text-outline' : 'opacity-70'}`}>
                  {dayLabel(date)}
                </p>
                <p className="text-[10px] opacity-60 mb-1">{format(date, 'd MMM')}</p>
                <p className="font-headline font-extrabold text-sm leading-none">£{price}</p>
                {price === min && !isSelected && (
                  <p className="text-[8px] font-bold text-secondary mt-0.5 uppercase">Best</p>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/20">
          <p className="text-xs text-outline">Price key:</p>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-secondary-container border border-secondary-container" />
            <span className="text-xs text-outline">Cheapest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-surface-container-lowest border border-outline-variant/50" />
            <span className="text-xs text-outline">Average</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-error-container/40 border border-error-container/40" />
            <span className="text-xs text-outline">Expensive</span>
          </div>
          <p className="text-xs text-outline ml-auto">Based on typical London departure pricing</p>
        </div>
      </div>
    </section>
  );
}
