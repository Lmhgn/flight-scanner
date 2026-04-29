import type { Deal } from '@/types/flights';
import Link from 'next/link';
import SaveButton from './SaveButton';

interface Props {
  deal: Deal;
  variant?: 'portrait' | 'landscape' | 'compact';
}

function buildDealUrl(deal: Deal) {
  return `/deals/${deal.id}`;
}

// Tiny seeded sparkline showing price trending down to the deal
function Sparkline({ deal }: { deal: Deal }) {
  const seed = deal.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const points = Array.from({ length: 10 }, (_, i) => {
    const t = i / 9;
    const base = 1 - t * 0.55;
    const jitter = ((seed * (i + 7) * 431) % 20 - 10) * 0.01;
    return Math.max(0.1, Math.min(1, base + jitter));
  });
  const W = 56;
  const H = 18;
  const pts = points
    .map((v, i) => `${((i / 9) * W).toFixed(1)},${((1 - v) * H).toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="opacity-60">
      <polyline points={pts} fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Tall portrait card (current month — 3-col grid)
function PortraitCard({ deal }: { deal: Deal }) {
  const href = buildDealUrl(deal);

  return (
    <Link href={href} className="group cursor-pointer block">
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container">
        <img
          src={deal.imageUrl}
          alt={deal.destination.city}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Save button */}
        <div className="absolute top-3 right-3">
          <SaveButton deal={deal} className="bg-black/20 backdrop-blur-sm rounded-full p-1" />
        </div>

        {/* Savings pill */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            -{deal.savingsPercent}%
          </span>
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5">
                {deal.directFlight ? 'Direct' : '1 stop'} · {deal.flightDuration}
              </p>
              <h3 className="text-white font-headline text-xl font-bold leading-tight">
                {deal.destination.city}
              </h3>
              <p className="text-white/50 text-xs">{deal.destination.country}</p>
            </div>
            <div className="text-right space-y-1">
              <Sparkline deal={deal} />
              <p className="text-white font-headline text-2xl font-extrabold leading-none">£{deal.price}</p>
              <p className="text-white/40 text-[10px] line-through">£{deal.originalPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Featured landscape card (next month — 2-wide)
export function FeaturedCard({ deal }: { deal: Deal }) {
  const href = buildDealUrl(deal);

  return (
    <Link href={href} className="md:col-span-2 relative h-[320px] rounded-xl overflow-hidden group cursor-pointer block">
      <img
        src={deal.imageUrl}
        alt={deal.destination.city}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-3 right-3">
        <SaveButton deal={deal} className="bg-black/20 backdrop-blur-sm rounded-full p-1" />
      </div>

      <div className="absolute top-3 left-3">
        <span className="bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          -{deal.savingsPercent}%
        </span>
      </div>

      <div className="absolute bottom-6 left-6 flex justify-between items-end w-[calc(100%-3rem)]">
        <div>
          <h3 className="text-white font-headline text-3xl font-bold">
            {deal.destination.city}
          </h3>
          <p className="text-white/60 text-sm">{deal.destination.country} · {deal.tags[0]}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-headline text-4xl font-extrabold">£{deal.price}</p>
        </div>
      </div>
    </Link>
  );
}

// Regular landscape card (next month — 1-wide)
export function RegularCard({ deal }: { deal: Deal }) {
  const href = buildDealUrl(deal);
  return (
    <Link href={href} className="relative h-[320px] rounded-xl overflow-hidden group cursor-pointer block">
      <img
        src={deal.imageUrl}
        alt={deal.destination.city}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          -{deal.savingsPercent}%
        </span>
      </div>
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white font-headline text-xl font-bold leading-tight">
          {deal.destination.city}
        </h3>
        <p className="text-white font-headline text-2xl font-extrabold">£{deal.price}</p>
      </div>
    </Link>
  );
}

// Compact tile (month after — 4-col table)
export function CompactCard({ deal, isFirst }: { deal: Deal; isFirst?: boolean }) {
  const href = buildDealUrl(deal);
  return (
    <Link
      href={href}
      className="bg-surface-container-lowest p-6 hover:bg-surface-bright transition-colors cursor-pointer block"
    >
      <h3 className="font-headline text-xl font-bold text-primary mb-0.5">
        {deal.destination.city}
      </h3>
      <p className="text-outline text-xs mb-4">{deal.destination.country}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-outline line-through mb-0.5">£{deal.originalPrice}</p>
          <p className="font-headline text-2xl font-extrabold">£{deal.price}</p>
        </div>
        <span className="text-xs font-bold text-secondary">-{deal.savingsPercent}%</span>
      </div>
    </Link>
  );
}

export default function DealCard({ deal, variant = 'portrait' }: Props) {
  if (variant === 'portrait') return <PortraitCard deal={deal} />;
  if (variant === 'landscape') return <RegularCard deal={deal} />;
  return <CompactCard deal={deal} />;
}
