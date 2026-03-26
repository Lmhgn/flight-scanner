import type { Deal } from '@/types/flights';
import { formatPrice, getDestinationGradient, savingsBadgeColor, formatDateShort } from '@/lib/utils';
import SourceLinks from './SourceLinks';
import { MapPin, Calendar, Plane, Clock } from 'lucide-react';

interface Props {
  deal: Deal;
}

const DEAL_TYPE_STYLES: Record<string, string> = {
  'Error Fare': 'bg-red-500/20 text-red-300 border border-red-500/30',
  "Jack's Find": 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  'Flash Sale': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  'Sale': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Early Bird': 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
};

const AIRPORT_NAMES: Record<string, string> = {
  LHR: 'Heathrow',
  LGW: 'Gatwick',
  STN: 'Stansted',
  LTN: 'Luton',
  LCY: 'City',
};

export default function DealCard({ deal }: Props) {
  const gradient = getDestinationGradient(deal.category);
  const savingsBg = savingsBadgeColor(deal.savingsPercent);
  const dealTypeStyle = DEAL_TYPE_STYLES[deal.dealType] ?? DEAL_TYPE_STYLES['Sale'];
  const isGreat = deal.dealScore === 'great';

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col ${
        isGreat ? 'deal-pulse ring-1 ring-emerald-500/30' : ''
      }`}
    >
      {/* Destination header */}
      <div className={`bg-gradient-to-br ${gradient} p-5 relative`}>
        {/* Savings badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${savingsBg}`}>
            -{deal.savingsPercent}%
          </span>
        </div>

        {/* Deal type badge */}
        <div className="mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${dealTypeStyle}`}>
            {deal.dealType}
          </span>
        </div>

        {/* Destination */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-3xl">{deal.destination.flag}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{deal.destination.city}</h3>
                <p className="text-sm text-white/70">{deal.destination.country}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-xs text-white/50 line-through">{formatPrice(deal.originalPrice)}</p>
            <p className="text-2xl font-black text-white">{formatPrice(deal.price)}</p>
            <p className="text-xs text-white/60">per person</p>
          </div>
        </div>
      </div>

      {/* Deal details */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Route info */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
          <span>
            London {AIRPORT_NAMES[deal.departureAirport]} ({deal.departureAirport}) →{' '}
            {deal.destination.code}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDateShort(deal.departureDate)}</span>
          </div>
          {deal.nights && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{deal.nights} nights</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Plane className="w-3.5 h-3.5 text-slate-500" />
            <span>{deal.airline}</span>
          </div>
        </div>

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {deal.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-slate-400 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Source links */}
        <div className="mt-auto pt-2 border-t border-white/5">
          <SourceLinks links={deal.sourceLinks} compact />
        </div>
      </div>
    </div>
  );
}
