import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import SaveButton from '@/components/SaveButton';
import { getMockDeals, getLastMinuteDeals } from '@/lib/mockDeals';
import { SOURCE_META } from '@/lib/deepLinks';
import { formatPrice, formatDateMedium } from '@/lib/utils';
import type { Deal, FlightSource } from '@/types/flights';
import ShareButton from '@/components/ShareButton';

export function generateStaticParams() {
  return [...getMockDeals(), ...getLastMinuteDeals()].map((d) => ({ id: d.id }));
}

// Seeded price history: 30 days trending down to the deal price
function priceHistory(deal: Deal): number[] {
  const seed = deal.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    const base = deal.originalPrice - (deal.originalPrice - deal.price) * (t ** 1.5);
    const jitter = ((seed * (i + 13) * 997) % 60 - 30) * 0.4;
    return Math.max(deal.price, Math.round(base + jitter));
  });
}

function PriceSparkline({ deal }: { deal: Deal }) {
  const prices = priceHistory(deal);
  const min = Math.min(...prices) * 0.97;
  const max = Math.max(...prices) * 1.02;
  const W = 400;
  const H = 64;

  const pts = prices
    .map((p, i) => {
      const x = (i / 29) * W;
      const y = H - ((p - min) / (max - min)) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const lastX = W;
  const lastY = H - ((deal.price - min) / (max - min)) * H;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-outline">30-day price trend</span>
        <span className="text-xs text-outline">Prices from London</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 64 }}>
        {/* Area fill */}
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00346f" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00346f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${H} ${pts} ${W},${H}`}
          fill="url(#sparkGrad)"
        />
        <polyline points={pts} fill="none" stroke="#00346f" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Current price dot */}
        <circle cx={lastX} cy={lastY} r="4" fill="#00346f" />
        <circle cx={lastX} cy={lastY} r="7" fill="#00346f" fillOpacity="0.2" />
      </svg>
      <div className="flex justify-between text-[10px] text-outline mt-1">
        <span>30 days ago</span>
        <span className="text-primary font-bold">Today · {formatPrice(deal.price)}</span>
      </div>
    </div>
  );
}

const DEAL_TIPS: Record<string, { icon: string; title: string; body: string }> = {
  'Error Fare': {
    icon: 'bolt',
    title: 'Book immediately',
    body: 'Error fares are pulled within hours once airlines notice. Book now and cancel later if plans change — most airlines offer 24h free cancellation.',
  },
  "Jack's Find": {
    icon: 'verified',
    title: "Jack's Flight Club verified",
    body: "This deal has been manually verified by Jack's Flight Club deal hunters. It's a genuine fare, not a glitch — but prices at this level don't last long.",
  },
  'Flash Sale': {
    icon: 'timer',
    title: 'Flash sale pricing',
    body: 'Airline flash sales typically last 24–72 hours. Seats at this price are limited. Book direct with the airline to ensure ticket validity.',
  },
  'Early Bird': {
    icon: 'schedule',
    title: 'Early bird discount',
    body: 'Early bird fares reward planning ahead. These prices usually hold for a few days, but availability shrinks as the departure date approaches.',
  },
  'Sale': {
    icon: 'trending_down',
    title: 'Sale pricing',
    body: 'This is a confirmed sale fare, significantly below the typical price for this route. Compare sources below before booking to find the best ticket.',
  },
};

function sourcePrice(deal: Deal, src: FlightSource): number {
  const multipliers: Record<FlightSource, number> = {
    google_flights: 1.04,
    skyscanner: 1.02,
    ita_matrix: 1.0,
    skiplagged: 0.97,
    jacks_flight_club: 1.07,
  };
  return Math.round(deal.price * multipliers[src]);
}

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const all = [...getMockDeals(), ...getLastMinuteDeals()];
  const deal = all.find((d) => d.id === params.id);
  if (!deal) notFound();

  const tip = DEAL_TIPS[deal.dealType] ?? DEAL_TIPS['Sale'];
  const savingAmt = deal.originalPrice - deal.price;
  const searchHref = `/search?origin=${deal.departureAirport}&originCity=London&destination=${deal.destination.code}&destinationCity=${encodeURIComponent(deal.destination.city)}&departDate=${deal.departureDate}&returnDate=${deal.returnDate ?? ''}&adults=1&cabin=ECONOMY`;

  const sources = Object.keys(SOURCE_META) as FlightSource[];
  const bestSrc = sources.reduce((best, s) =>
    sourcePrice(deal, s) < sourcePrice(deal, best) ? s : best, sources[0]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <img
          src={deal.imageUrl}
          alt={deal.destination.city}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back link */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to deals
        </Link>

        {/* Save button */}
        <div className="absolute top-6 right-6">
          <SaveButton deal={deal} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2" />
        </div>

        {/* Hero content */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[1600px] px-6 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{deal.destination.flag}</span>
                <span className="bg-error text-on-error text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {deal.dealType}
                </span>
                <span className="bg-secondary-container/80 text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  -{deal.savingsPercent}% off
                </span>
              </div>
              <h1 className="font-headline text-5xl font-extrabold text-white leading-none mb-1">
                {deal.destination.city}
              </h1>
              <p className="text-white/70 text-lg">{deal.destination.country}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-sm line-through mb-0.5">{formatPrice(deal.originalPrice)}</p>
              <p className="font-headline text-6xl font-extrabold text-white leading-none">{formatPrice(deal.price)}</p>
              <p className="text-white/60 text-sm mt-1">per person · economy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal strip */}
      <div className="bg-surface-container-low border-b border-outline-variant/20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-4">
          <div className="flex items-center gap-8 text-sm flex-wrap">
            {[
              { icon: 'flight_takeoff', label: 'Departs', value: formatDateMedium(deal.departureDate) },
              { icon: 'flight_land',   label: 'Returns', value: deal.returnDate ? formatDateMedium(deal.returnDate) : 'One-way' },
              { icon: 'hotel',         label: 'Nights',  value: deal.nights ? `${deal.nights} nights` : '—' },
              { icon: 'airlines',      label: 'Airline', value: deal.airline },
              { icon: 'schedule',      label: 'Duration', value: deal.flightDuration ?? '—' },
              { icon: 'connecting_airports', label: 'Stops', value: deal.directFlight ? 'Direct' : '1 stop' },
              { icon: 'location_on',   label: 'From', value: deal.departureAirport },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">{icon}</span>
                <span className="text-outline">{label}:</span>
                <span className="font-semibold text-on-surface">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 md:px-10 py-10">
        <div className="grid grid-cols-12 gap-10">

          {/* Left — source comparison + sparkline + search CTA */}
          <div className="col-span-8 space-y-10">

            {/* Source price comparison */}
            <section>
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="font-headline text-2xl font-bold">Search Across Sources</h2>
                <span className="text-sm text-outline">prices are estimated — verify before booking</span>
              </div>
              <div className="space-y-3">
                {sources.map((src) => {
                  const meta = SOURCE_META[src];
                  const link = deal.sourceLinks.find((l) => l.source === src);
                  const price = sourcePrice(deal, src);
                  const isBest = src === bestSrc;
                  const isHighest = price === Math.max(...sources.map((s) => sourcePrice(deal, s)));

                  return (
                    <div
                      key={src}
                      className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                        isBest
                          ? 'border-secondary bg-secondary-container/20'
                          : 'border-outline-variant/30 bg-surface-container-lowest'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: meta.bgColor }}
                        >
                          <span className="text-xs font-extrabold" style={{ color: meta.color }}>
                            {meta.shortLabel.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{meta.label}</p>
                          {isBest && (
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                              Lowest price
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className={`font-headline font-extrabold text-xl ${isBest ? 'text-secondary' : isHighest ? 'text-error' : 'text-primary'}`}>
                            {formatPrice(price)}
                          </p>
                          {price !== deal.price && (
                            <p className="text-[10px] text-outline">
                              {price > deal.price ? `+${formatPrice(price - deal.price)} vs best` : `Save ${formatPrice(deal.price - price)}`}
                            </p>
                          )}
                        </div>
                        <a
                          href={link?.url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                            isBest
                              ? 'bg-secondary text-on-secondary hover:opacity-90'
                              : 'border border-outline-variant hover:border-primary hover:text-primary'
                          }`}
                        >
                          Search
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Price history */}
            <section className="bg-surface-container-low rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">show_chart</span>
                <h2 className="font-headline text-xl font-bold">Price History</h2>
              </div>
              <PriceSparkline deal={deal} />
              <div className="flex items-center gap-6 mt-5 pt-4 border-t border-outline-variant/20 text-sm">
                <div>
                  <p className="text-xs text-outline mb-0.5">Typical price</p>
                  <p className="font-bold">{formatPrice(deal.originalPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-outline mb-0.5">Deal price</p>
                  <p className="font-bold text-primary">{formatPrice(deal.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-outline mb-0.5">You save</p>
                  <p className="font-bold text-secondary">{formatPrice(savingAmt)} ({deal.savingsPercent}%)</p>
                </div>
              </div>
            </section>

            {/* Search this route */}
            <section className="primary-gradient rounded-xl p-8 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-primary mb-1">
                  Search all flights on this route
                </h3>
                <p className="text-primary-fixed-dim text-sm">
                  {deal.destination.city} · {deal.departureDate}{deal.returnDate ? ` – ${deal.returnDate}` : ''}
                </p>
              </div>
              <Link
                href={searchHref}
                className="bg-white text-primary font-bold px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-surface-container transition-colors flex-shrink-0"
              >
                Search Flights
                <span className="material-symbols-outlined text-sm ml-2 align-middle">arrow_forward</span>
              </Link>
            </section>
          </div>

          {/* Right sidebar — tips, tags, deal meta */}
          <div className="col-span-4 space-y-6">

            {/* Deal tip */}
            <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {tip.icon}
                </span>
                <h3 className="font-headline font-bold text-lg">{tip.title}</h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{tip.body}</p>
            </div>

            {/* Tags */}
            <div className="bg-surface-container-low rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Deal tags</p>
              <div className="flex flex-wrap gap-2">
                {deal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-container text-on-surface-variant text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Savings summary */}
            <div className="border border-secondary/30 rounded-xl p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-outline">Savings breakdown</p>
              <div className="space-y-3">
                {[
                  { label: 'Normal price', value: formatPrice(deal.originalPrice), muted: true },
                  { label: 'Deal price', value: formatPrice(deal.price), highlight: true },
                  { label: 'You save', value: `${formatPrice(savingAmt)} (${deal.savingsPercent}%)`, bold: true },
                ].map(({ label, value, muted, highlight, bold }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className={muted ? 'text-outline' : 'text-on-surface'}>{label}</span>
                    <span className={`font-bold ${highlight ? 'text-primary' : bold ? 'text-secondary' : muted ? 'line-through text-outline' : ''}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share/save actions */}
            <div className="flex gap-3">
              <SaveButton
                deal={deal}
                className="flex-1 flex items-center justify-center gap-2 border border-outline-variant rounded-xl py-3 text-sm font-bold text-on-surface hover:border-primary hover:text-primary transition-colors"
              />
              <ShareButton className="flex-1 flex items-center justify-center gap-2 border border-outline-variant rounded-xl py-3 text-sm font-bold text-on-surface hover:border-primary hover:text-primary transition-colors" />
            </div>
          </div>

        </div>
      </main>

      <footer className="w-full py-10 px-6 md:px-10 mt-auto bg-surface-container-low border-t border-outline-variant/15">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <span className="font-headline font-bold text-on-surface">FlightFlux</span>
          <p className="text-xs text-outline">Price history is indicative. Always verify on the booking source before purchasing.</p>
        </div>
      </footer>
    </div>
  );
}
