'use client';

import { useState } from 'react';
import type { Deal } from '@/types/flights';
import DealCard from './DealCard';
import { getMonthBuckets } from '@/lib/utils';
import { TrendingDown, Sparkles } from 'lucide-react';

interface Props {
  deals: Deal[];
}

export default function DealsSection({ deals }: Props) {
  const months = getMonthBuckets(3);
  const [activeMonth, setActiveMonth] = useState(0);

  const filtered = deals.filter((d) => d.month === months[activeMonth].month);
  const greatDeals = filtered.filter((d) => d.dealScore === 'great').length;

  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Hot Deals</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Curated deals for spontaneous travel — error fares, flash sales &amp; hidden gems
          </p>
        </div>

        {greatDeals > 0 && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              {greatDeals} great deal{greatDeals !== 1 ? 's' : ''} this period
            </span>
          </div>
        )}
      </div>

      {/* Month tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {months.map((m, i) => {
          const count = deals.filter((d) => d.month === m.month).length;
          return (
            <button
              key={m.month}
              onClick={() => setActiveMonth(i)}
              className={`month-tab flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                activeMonth === i
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : 'bg-white/4 border-white/8 text-slate-400 hover:text-slate-200 hover:bg-white/6'
              }`}
            >
              {i === 0 ? 'This Month' : m.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeMonth === i ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Deals grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No deals found for this period.</p>
          <p className="text-sm mt-1">Check back soon — new deals are added daily.</p>
        </div>
      ) : (
        <div className="deals-grid">
          {filtered.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </section>
  );
}
