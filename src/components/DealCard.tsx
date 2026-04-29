import type { Deal } from '@/types/flights';
import Link from 'next/link';
import SaveButton from './SaveButton';

interface Props {
  deal: Deal;
  variant?: 'portrait' | 'landscape' | 'compact';
}

const DEAL_TYPE_BADGE: Record<string, { icon: string; label: string }> = {
  'Error Fare':   { icon: 'auto_awesome', label: 'ERROR FARE' },
  "Jack's Find":  { icon: 'auto_awesome', label: 'HIDDEN DEAL' },
  'Flash Sale':   { icon: 'bolt',          label: 'FLASH DEAL' },
  'Sale':         { icon: 'trending_down', label: 'PRICE DROP' },
  'Early Bird':   { icon: 'verified',      label: 'ELITE PICK' },
};

function buildDealUrl(deal: Deal) {
  return `/deals/${deal.id}`;
}

// Tall portrait card (current month — 3-col grid)
function PortraitCard({ deal }: { deal: Deal }) {
  const badge = DEAL_TYPE_BADGE[deal.dealType] ?? DEAL_TYPE_BADGE['Sale'];
  const href = buildDealUrl(deal);

  return (
    <Link href={href} className="group cursor-pointer block">
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-4 bg-surface-container">
        <img
          src={deal.imageUrl}
          alt={deal.destination.city}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Deal type badge + save */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="glass-badge px-3 py-1.5 rounded-full flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {badge.icon}
            </span>
            <span className="text-secondary font-bold text-xs font-label">{badge.label}</span>
          </div>
          <SaveButton deal={deal} className="glass-badge" />
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/80 text-xs font-label uppercase tracking-widest mb-1">
                {deal.directFlight ? 'Direct' : '1 stop'} · {deal.flightDuration}
              </p>
              <h3 className="text-white font-headline text-2xl font-bold leading-none">
                {deal.destination.city}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs line-through">£{deal.originalPrice}</p>
              <p className="text-white font-headline text-3xl font-extrabold leading-none">£{deal.price}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Featured landscape card (next month — 2-wide)
export function FeaturedCard({ deal }: { deal: Deal }) {
  const badge = DEAL_TYPE_BADGE[deal.dealType] ?? DEAL_TYPE_BADGE['Sale'];
  const href = buildDealUrl(deal);

  return (
    <Link href={href} className="md:col-span-2 relative h-[320px] rounded-lg overflow-hidden group cursor-pointer block">
      <img
        src={deal.imageUrl}
        alt={deal.destination.city}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="glass-badge px-3 py-1.5 rounded-full flex items-center gap-2">
          <span
            className="material-symbols-outlined text-secondary text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {badge.icon}
          </span>
          <span className="text-secondary font-bold text-xs font-label">{badge.label}</span>
        </div>
        <SaveButton deal={deal} className="glass-badge" />
      </div>
      <div className="absolute bottom-6 left-6 flex justify-between items-end w-[calc(100%-3rem)]">
        <div>
          <h3 className="text-white font-headline text-3xl font-bold">
            {deal.destination.city}, {deal.destination.country.slice(0, 2).toUpperCase()}
          </h3>
          <p className="text-white/70 font-label text-sm">{deal.tags[0]}</p>
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
    <Link href={href} className="relative h-[320px] rounded-lg overflow-hidden group cursor-pointer block">
      <img
        src={deal.imageUrl}
        alt={deal.destination.city}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white font-headline text-xl font-bold leading-tight">
          {deal.destination.city}, {deal.destination.country.slice(0, 2).toUpperCase()}
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
      {isFirst && (
        <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter mb-4 inline-block">
          Flash Deal
        </span>
      )}
      <h3 className="font-headline text-xl font-bold text-primary mb-1">
        {deal.destination.city}
      </h3>
      <p className="text-outline text-xs mb-4">{deal.tags[0]}</p>
      <div className="flex items-end justify-between">
        <p className="font-headline text-2xl font-extrabold">£{deal.price}</p>
        <span className="material-symbols-outlined text-primary">
          {isFirst ? 'bolt' : 'chevron_right'}
        </span>
      </div>
    </Link>
  );
}

export default function DealCard({ deal, variant = 'portrait' }: Props) {
  if (variant === 'portrait') return <PortraitCard deal={deal} />;
  if (variant === 'landscape') return <RegularCard deal={deal} />;
  return <CompactCard deal={deal} />;
}
