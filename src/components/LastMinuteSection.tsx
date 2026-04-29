import type { Deal } from '@/types/flights';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface Props {
  deals: Deal[];
}

function buildHref(deal: Deal) {
  const p = new URLSearchParams({
    origin: deal.departureAirport, originCity: 'London',
    destination: deal.destination.code, destinationCity: deal.destination.city,
    departDate: deal.departureDate, returnDate: deal.returnDate ?? '',
    adults: '1', cabin: 'ECONOMY',
  });
  return `/search?${p}`;
}

function daysLabel(dateStr: string): string {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

export default function LastMinuteSection({ deals }: Props) {
  if (deals.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <h2 className="font-headline text-2xl font-bold">Leaving This Week</h2>
          <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold font-label">
            THIS WEEK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            href={buildHref(deal)}
            className="group relative rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/30 hover:shadow-[0_4px_20px_-4px_rgba(0,52,111,0.15)] transition-all duration-200 cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-28 overflow-hidden">
              <img
                src={deal.imageUrl}
                alt={deal.destination.city}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Departure badge */}
              <div className="absolute top-2 left-2 bg-error text-on-error text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {daysLabel(deal.departureDate)}
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-sm">{deal.destination.flag}</span>
                <p className="font-headline font-bold text-sm text-on-surface leading-tight truncate">
                  {deal.destination.city}
                </p>
              </div>
              <p className="text-[10px] text-outline mb-1">
                {deal.directFlight ? 'Direct' : '1 stop'} · {deal.flightDuration}
              </p>
              <div className="flex items-center justify-between">
                <p className="font-headline font-extrabold text-base text-primary">
                  {formatPrice(deal.price)}
                </p>
                <span className="text-[10px] text-outline line-through">{formatPrice(deal.originalPrice)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
